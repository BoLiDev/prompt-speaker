import { ipcMain as _, app as n, BrowserWindow as c } from "electron";
import o from "node:path";
import { fileURLToPath as f } from "node:url";
import E from "node:fs";
import v from "node:os";
const l = o.dirname(f(import.meta.url));
process.env.APP_ROOT = o.join(l, "..");
const s = process.env.VITE_DEV_SERVER_URL,
  D = o.join(process.env.APP_ROOT, "dist-electron"),
  a = o.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = s ? o.join(process.env.APP_ROOT, "public") : a;
process.env.GRPC_DNS_RESOLVER = "native";
let e;
function p() {
  (e = new c({
    icon: o.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: o.join(l, "preload.mjs"),
      nodeIntegration: !0,
      contextIsolation: !1,
    },
  })),
    e.webContents.on("did-finish-load", () => {
      e == null ||
        e.webContents.send(
          "main-process-message",
          /* @__PURE__ */ new Date().toLocaleString(),
        ),
        console.log("📝 Renderer process loaded");
    }),
    s
      ? (e.loadURL(s),
        e.webContents.openDevTools(),
        console.log("🔧 DevTools opened automatically in dev mode"))
      : e.loadFile(o.join(a, "index.html"));
}
_.handle("create-temp-file", (i, t) => {
  const d = v.tmpdir(),
    m = t.prefix || "temp_",
    R = t.extension ? `.${t.extension}` : "",
    r = o.join(d, `${m}${Date.now()}${R}`);
  return E.writeFileSync(r, ""), r;
});
n.on("window-all-closed", () => {
  process.platform !== "darwin" && (n.quit(), (e = null));
});
n.on("activate", () => {
  c.getAllWindows().length === 0 && p();
});
n.whenReady().then(p);
process.on("uncaughtException", (i) => {
  console.error("🚨 Uncaught exception in main process:", i);
});
export { D as MAIN_DIST, a as RENDERER_DIST, s as VITE_DEV_SERVER_URL };
