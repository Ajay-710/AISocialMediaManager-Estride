const { spawn } = require('child_process');

const mcp = spawn('npx', ['-y', '@21st-dev/magic@latest'], {
  env: { ...process.env, API_KEY: "3106f5dd337f1c9b15308c0621ddde5ed8664c20329e286972550ed63c78e18b" },
  shell: true
});

mcp.stdout.on('data', data => console.log('OUT:', data.toString()));
mcp.stderr.on('data', data => console.error('ERR:', data.toString()));

mcp.on('close', code => console.log(`child process exited with code ${code}`));

const send = (msg) => mcp.stdin.write(JSON.stringify(msg) + '\n');

setTimeout(() => {
  send({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "client", version: "1.0" }
    }
  });
}, 5000); // Give 5 seconds for npx to start

setTimeout(() => {
  send({
    jsonrpc: "2.0",
    id: 2,
    method: "notifications/initialized"
  });
  
  send({
    jsonrpc: "2.0",
    id: 3,
    method: "tools/list"
  });
}, 10000);

setTimeout(() => {
  mcp.kill();
}, 25000);
