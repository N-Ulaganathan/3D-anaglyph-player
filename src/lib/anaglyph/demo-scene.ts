type Pass = "color" | "depth";

type Vec3 = { x: number; y: number; z: number };

type Sprite = {
  z: number;
  draw: (ctx: CanvasRenderingContext2D, pass: Pass) => void;
};

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function depthGray(z: number, near = 2.4, far = 12) {
  const t = clamp01((z - near) / (far - near));
  const d = 1 - t;
  const g = Math.round(40 + d * 215);
  return `rgb(${g}, ${g}, ${g})`;
}

export class DemoScene {
  readonly color: HTMLCanvasElement;
  readonly depth: HTMLCanvasElement;
  private readonly cw: CanvasRenderingContext2D;
  private readonly dw: CanvasRenderingContext2D;
  readonly width: number;
  readonly height: number;

  constructor(width = 1280, height = 720) {
    this.width = width;
    this.height = height;
    this.color = document.createElement("canvas");
    this.depth = document.createElement("canvas");
    this.color.width = width;
    this.color.height = height;
    this.depth.width = width;
    this.depth.height = height;
    const cw = this.color.getContext("2d", { alpha: false });
    const dw = this.depth.getContext("2d", { alpha: false });
    if (!cw || !dw) throw new Error("Canvas 2D is not available");
    this.cw = cw;
    this.dw = dw;
  }

  draw(time: number) {
    this.drawPass(this.cw, time, "color");
    this.drawPass(this.dw, time, "depth");
  }

  destroy() {
    this.color.width = 1;
    this.color.height = 1;
    this.depth.width = 1;
    this.depth.height = 1;
  }

  private project(p: Vec3, time: number) {
    const a = time * 0.22;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    const rx = p.x * ca - p.z * sa;
    const rz = p.x * sa + p.z * ca;
    const camZ = rz + 5.6;
    const camY = p.y - 0.05 + Math.sin(time * 0.4) * 0.06;
    const f = 2.6;
    const s = f / camZ;
    return {
      x: this.width * 0.5 + rx * s * this.width * 0.46,
      y: this.height * 0.5 + camY * s * this.width * 0.46,
      z: camZ,
      s,
    };
  }

  private drawPass(ctx: CanvasRenderingContext2D, time: number, pass: Pass) {
    const { width: w, height: h } = this;
    if (pass === "color") {
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, "#2a3140");
      sky.addColorStop(0.42, "#1b2028");
      sky.addColorStop(1, "#12141a");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);
    } else {
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, w, h);
    }

    const sprites: Sprite[] = [];

    if (pass === "color") {
      sprites.push({
        z: 12,
        draw: (c) => {
          c.save();
          for (let i = 0; i < 70; i++) {
            const seed = i * 17.17;
            const x = ((seed * 73.1) % 1) * w;
            const y = ((seed * 29.7) % 1) * h * 0.5;
            const tw = 0.35 + Math.sin(time * 1.6 + seed) * 0.2;
            c.fillStyle = `rgba(236,240,246,${0.35 + tw})`;
            c.beginPath();
            c.arc(x, y, 1.1 + (i % 3) * 0.5, 0, Math.PI * 2);
            c.fill();
          }
          c.restore();
        },
      });
    }

    for (let i = -7; i <= 7; i++) {
      for (let k = 0; k < 10; k++) {
        const z0 = 0.8 + k * 0.7;
        const z1 = z0 + 0.7;
        const x = i * 0.7;
        sprites.push({
          z: z0 + 3,
          draw: (c) => {
            const a = this.project({ x, y: 1.05, z: z0 }, time);
            const b = this.project({ x, y: 1.05, z: z1 }, time);
            const fade = clamp01(1.2 - k / 10);
            if (pass === "depth") {
              c.strokeStyle = depthGray((a.z + b.z) * 0.5);
              c.lineWidth = 3;
            } else {
              c.strokeStyle = `rgba(210,218,228,${0.16 + fade * 0.38})`;
              c.lineWidth = 1.6;
            }
            c.beginPath();
            c.moveTo(a.x, a.y);
            c.lineTo(b.x, b.y);
            c.stroke();
          },
        });
      }
    }
    for (let k = 0; k < 10; k++) {
      const z = 0.8 + k * 0.7;
      sprites.push({
        z: z + 3,
        draw: (c) => {
          const a = this.project({ x: -4.9, y: 1.05, z }, time);
          const b = this.project({ x: 4.9, y: 1.05, z }, time);
          const fade = clamp01(1.2 - k / 10);
          if (pass === "depth") {
            c.strokeStyle = depthGray(a.z);
            c.lineWidth = 3;
          } else {
            c.strokeStyle = `rgba(210,218,228,${0.16 + fade * 0.38})`;
            c.lineWidth = 1.6;
          }
          c.beginPath();
          c.moveTo(a.x, a.y);
          c.lineTo(b.x, b.y);
          c.stroke();
        },
      });
    }

    const pillars = [-2.4, -1.2, 1.2, 2.4];
    for (const x of pillars) {
      sprites.push({
        z: 4.4,
        draw: (c) => {
          const top = this.project({ x, y: -1.15, z: 0.9 }, time);
          const bot = this.project({ x, y: 1.05, z: 0.9 }, time);
          const r = Math.max(10, 22 * top.s * 7);
          if (pass === "depth") {
            c.fillStyle = depthGray(top.z);
            c.fillRect(top.x - r * 0.32, top.y, r * 0.64, bot.y - top.y);
          } else {
            const g = c.createLinearGradient(top.x - r, top.y, top.x + r, bot.y);
            g.addColorStop(0, "#3a3f48");
            g.addColorStop(0.45, "#e4e8ee");
            g.addColorStop(1, "#23262c");
            c.fillStyle = g;
            c.fillRect(top.x - r * 0.32, top.y, r * 0.64, bot.y - top.y);
          }
        },
      });
    }

    const orbs: Array<{ p: Vec3; hue: string; r: number }> = [
      { p: { x: -1.35, y: -0.05, z: -0.55 }, hue: "#e06a58", r: 0.58 },
      { p: { x: 1.45, y: 0.12, z: 0.35 }, hue: "#3db4c0", r: 0.48 },
      { p: { x: 0.05, y: -0.48, z: 1.15 }, hue: "#f2f4f7", r: 0.32 },
      { p: { x: -2.15, y: 0.28, z: 1.7 }, hue: "#a8b0ba", r: 0.24 },
      { p: { x: 2.2, y: -0.28, z: -0.9 }, hue: "#c5ced6", r: 0.36 },
    ];

    for (const orb of orbs) {
      const bob = Math.sin(time * 0.9 + orb.p.x) * 0.1;
      const p = { ...orb.p, y: orb.p.y + bob };
      const q = this.project(p, time);
      sprites.push({
        z: q.z,
        draw: (c) => {
          const radius = Math.max(18, orb.r * q.s * this.width * 0.46);
          if (pass === "depth") {
            c.fillStyle = depthGray(q.z);
            c.beginPath();
            c.arc(q.x, q.y, radius, 0, Math.PI * 2);
            c.fill();
            return;
          }
          const g = c.createRadialGradient(
            q.x - radius * 0.32,
            q.y - radius * 0.34,
            radius * 0.08,
            q.x,
            q.y,
            radius,
          );
          g.addColorStop(0, "#ffffff");
          g.addColorStop(0.28, orb.hue);
          g.addColorStop(1, "#14161c");
          c.fillStyle = g;
          c.beginPath();
          c.arc(q.x, q.y, radius, 0, Math.PI * 2);
          c.fill();
        },
      });
    }

    sprites.sort((a, b) => b.z - a.z);
    for (const sprite of sprites) sprite.draw(ctx, pass);
  }
}
