// ===== 基础设置 =====
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // 天空蓝

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 6, 12);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ===== 光照 =====
const sun = new THREE.DirectionalLight(0xffffff, 1.2);
sun.position.set(10, 20, 10);
scene.add(sun);

scene.add(new THREE.AmbientLight(0xffffff, 0.4));

// ===== 地面（沙漠）=====
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({ color: 0xd2b48c })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// ===== 骆驼（简化模型）=====
const camel = new THREE.Group();

const body = new THREE.Mesh(
  new THREE.BoxGeometry(2, 1, 4),
  new THREE.MeshStandardMaterial({ color: 0xc2a060 })
);
body.position.y = 1.2;
camel.add(body);

const hump = new THREE.Mesh(
  new THREE.SphereGeometry(0.7, 16, 16),
  new THREE.MeshStandardMaterial({ color: 0xb8965a })
);
hump.position.set(0, 1.8, -0.5);
camel.add(hump);

const head = new THREE.Mesh(
  new THREE.BoxGeometry(0.8, 0.6, 1),
  new THREE.MeshStandardMaterial({ color: 0xc2a060 })
);
head.position.set(0, 1.6, 2.5);
camel.add(head);

camel.position.y = 0;
scene.add(camel);

// ===== 障碍物 =====
const obstacles = [];
const obstacleGeo = new THREE.CylinderGeometry(0.5, 0.7, 2, 8);
const obstacleMat = new THREE.MeshStandardMaterial({ color: 0x2e8b57 });

function spawnObstacle() {
  const obj = new THREE.Mesh(obstacleGeo, obstacleMat);
  obj.position.set(
    (Math.random() - 0.5) * 6,
    1,
    -60
  );
  scene.add(obj);
  obstacles.push(obj);
}

// ===== 音乐 =====
const music = new Audio("assets/music.mp3");
music.loop = true;
let musicStarted = false;

// ===== 控制 =====
let speed = 0.4;
let paused = false;

document.addEventListener("keydown", e => {
  if (!musicStarted) {
    music.play();
    musicStarted = true;
  }

  if (e.code === "ArrowLeft") camel.position.x -= 0.6;
  if (e.code === "ArrowRight") camel.position.x += 0.6;
});

document.getElementById("pauseBtn").onclick = () => {
  paused = !paused;
  if (paused) {
    music.pause();
  } else {
    music.play();
  }
};

// ===== 主循环 =====
let frame = 0;

function animate() {
  requestAnimationFrame(animate);
  if (paused) return;

  frame++;
  camel.position.z -= speed;

  // 镜头跟随
  camera.position.z = camel.position.z + 12;

  // 生成障碍
  if (frame % 120 === 0) spawnObstacle();

  obstacles.forEach(o => {
    o.position.z += speed;

    // 碰撞检测
    if (o.position.distanceTo(camel.position) < 1.5) {
      alert("Game Over");
      location.reload();
    }
  });

  renderer.render(scene, camera);
}

animate();

// ===== 自适应 =====
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
