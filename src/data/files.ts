import type { FileNode, Language } from "@/types";

// forge-core 的文件树（含真实感代码）
const forgeCoreReadme = `# forge-core

> Nebula OpenSource 的核心 Git 服务实现 —— 纯 Zig 编写，单二进制部署。

## 特性

- 单二进制部署，体积 < 8MB
- clone 大仓库内存占用 < 16MB（流式）
- SSH / HTTP 双协议，开箱即用
- Webhook、Issue、PR 一应俱全
- 自定义 Hook 与 CI 钩子

## 快速开始

\`\`\`sh
# 拉取镜像
docker run -d -p 2222:22 -p 3000:3000 \\
  -v forge-data:/data \\
  nebula-opensource/forge-core:latest

# 推送你的第一个仓库
git clone ssh://git@localhost:2222/aurora/forge-core.git
\`\`\`

## 性能

| 指标 | forge-core | Gitea |
|------|-----------|-------|
| clone linux 内核 | 1.8s | 5.4s |
| 内存峰值 | 12MB | 380MB |
| 二进制体积 | 7.8MB | 82MB |

## 贡献

欢迎提交 PR。请先阅读 [CONTRIBUTING](./CONTRIBUTING.md)。

## License

MIT © Nebula OpenSource
`;

const readerCode = `const std = @import("std");
const Stream = @import("stream.zig").BufferedStream;

/// 从 reader 流式读取 pack 文件，避免一次性载入。
pub fn readPack(reader: anytype) !Pack {
    var buf: [4096]u8 = undefined;
    var stream = Stream.init(reader, &buf);
    return parsePackStream(&stream);
}

fn parsePackStream(stream: *Stream) !Pack {
    const header = try stream.readN(12);
    if (!std.mem.eql(u8, header[0..4], "PACK")) {
        return error.InvalidSignature;
    }
    const version = std.mem.readInt(u32, header[4..8], .big);
    if (version != 2 and version != 3) return error.UnsupportedVersion;

    const count = std.mem.readInt(u32, header[8..12], .big);
    var objects = try allocator.alloc(Object, count);

    var i: usize = 0;
    while (i < count) : (i += 1) {
        objects[i] = try parseObject(stream);
    }
    return Pack{ .objects = objects };
}

test "readPack 增量" {
    var fbs = std.io.fixedBufferStream(fixture);
    const pack = try readPack(fbs.reader());
    try std.testing.expectEqual(@as(usize, 3), pack.objects.len);
}
`;

const streamCode = `const std = @import("std");

/// 带缓冲的流式读取器，零拷贝滚动窗口。
pub const BufferedStream = struct {
    buf: []u8,
    pos: usize = 0,
    len: usize = 0,
    reader: std.io.AnyReader,

    pub fn init(reader: anytype, buf: []u8) BufferedStream {
        return .{
            .buf = buf,
            .reader = reader.any(),
        };
    }

    pub fn fill(self: *BufferedStream) !void {
        self.len = try self.reader.read(self.buf);
        self.pos = 0;
    }

    pub fn readN(self: *BufferedStream, n: usize) ![]const u8 {
        if (self.pos + n > self.len) {
            try self.fill();
        }
        const out = self.buf[self.pos .. self.pos + n];
        self.pos += n;
        return out;
    }
};
`;

const configCode = `# forge-core 配置示例
[server]
host = "0.0.0.0"
http_port = 3000
ssh_port = 2222
workers = 4

[storage]
data_dir = "/data"
[storage.pack]
stream = true
window = 4096

[ssh]
key_path = "/data/ssh/forge_ed25519"

[webhook]
secret = "change-me"
algorithm = "hmac-sha256"
`;

export const forgeCoreTree: FileNode[] = [
  {
    name: "src",
    type: "dir",
    children: [
      {
        name: "pack",
        type: "dir",
        children: [
          { name: "reader.zig", type: "file", language: "Zig" as Language, content: readerCode, size: 1024 },
          { name: "stream.zig", type: "file", language: "Zig" as Language, content: streamCode, size: 612 },
          { name: "writer.zig", type: "file", language: "Zig" as Language, content: "// pack 写入器\npub fn writePack() void {}\n", size: 88 },
        ],
      },
      {
        name: "net",
        type: "dir",
        children: [
          { name: "ssh.zig", type: "file", language: "Zig" as Language, content: "// SSH 握手与传输\nconst std = @import(\"std\");\n\npub fn handshake(conn: *Conn) !void {\n    const key = conn.session.key orelse return error.MissingSessionKey;\n    try writeKey(conn, key);\n}\n", size: 412 },
          { name: "http.zig", type: "file", language: "Zig" as Language, content: "// HTTP 智能协议\n", size: 64 },
        ],
      },
      { name: "main.zig", type: "file", language: "Zig" as Language, content: 'const std = @import("std");\nconst Server = @import("server.zig").Server;\n\npub fn main() !void {\n    var gpa = std.heap.GeneralPurposeAllocator(.{}){};\n    defer _ = gpa.deinit();\n    const alloc = gpa.allocator();\n\n    var server = try Server.init(alloc, .{ .port = 3000 });\n    defer server.deinit();\n\n    try server.run();\n}\n', size: 312 },
      { name: "server.zig", type: "file", language: "Zig" as Language, content: "// 主服务循环\n", size: 48 },
    ],
  },
  {
    name: "config",
    type: "dir",
    children: [
      { name: "forge.toml", type: "file", language: "Shell" as Language, content: configCode, size: 256 },
    ],
  },
  { name: "README.md", type: "file", language: "Markdown" as Language, content: forgeCoreReadme, size: 1024 },
  { name: "LICENSE", type: "file", language: "Shell" as Language, content: "MIT License\n\nCopyright (c) 2024 Nebula OpenSource\n\n...", size: 1024 },
  { name: "build.zig", type: "file", language: "Zig" as Language, content: 'const std = @import("std");\n\npub fn build(b: *std.Build) void {\n    const target = b.standardTargetOptions(.{});\n    const optimize = b.standardOptimizeOption(.{});\n\n    const exe = b.addExecutable(.{\n        .name = "forge-core",\n        .root_source_file = b.path("src/main.zig"),\n        .target = target,\n        .optimize = optimize,\n    });\n    b.installArtifact(exe);\n}\n', size: 412 },
];

// 通用回退文件树
const genericReadme = (name: string, desc: string) => `# ${name}

> ${desc}

## 安装

\`\`\`sh
git clone https://opensource.nebulastudios.top/your-name/${name}.git
cd ${name}
\`\`\`

## 使用

文档即将补充。欢迎在 Issue 区提出你的问题。

## License

MIT
`;

export function getFileTree(owner: string, name: string): FileNode[] {
  if (owner === "aurora" && name === "forge-core") return forgeCoreTree;

  // 通用回退
  return [
    {
      name: "src",
      type: "dir",
      children: [
        { name: "index.ts", type: "file", language: "TypeScript" as Language, content: `// ${name} 入口\nexport function main() {\n  console.log("${name} ready");\n}\n`, size: 96 },
        { name: "lib.ts", type: "file", language: "TypeScript" as Language, content: `// 核心库\nexport const version = "0.1.0";\n`, size: 48 },
      ],
    },
    { name: "README.md", type: "file", language: "Markdown" as Language, content: genericReadme(`${owner}/${name}`, "一个由 Nebula OpenSource 托管的项目。"), size: 256 },
    { name: "LICENSE", type: "file", language: "Shell" as Language, content: "MIT License\n", size: 64 },
    { name: ".gitignore", type: "file", language: "Shell" as Language, content: "node_modules/\ndist/\n.env\n", size: 32 },
  ];
}

// 通用 README 内容（用于仓库详情页底部）
export function getReadme(owner: string, name: string, desc: string): string {
  if (owner === "aurora" && name === "forge-core") return forgeCoreReadme;
  return genericReadme(`${owner}/${name}`, desc);
}
