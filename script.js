document.getElementById('pyramidForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const width = parseFloat(document.getElementById('width').value);
    const depth = parseFloat(document.getElementById('depth').value);
    const height = parseFloat(document.getElementById('height').value);
    const slantHeight1 = Math.sqrt((width / 2) ** 2 + height ** 2);
    const slantHeight2 = Math.sqrt((depth / 2) ** 2 + height ** 2);
    const lateralArea = width * slantHeight2 + depth * slantHeight1;
    const surfaceArea = lateralArea; // Exclude the base area
    document.getElementById('surfaceArea').innerText = `სახურავის ფართობი შეადგენს: ${surfaceArea.toFixed(2)} მეტრს`;
    drawPyramid(width, height, depth);
});

function drawPyramid(width, height, depth) {
    const container = document.getElementById('pyramidContainer');
    container.innerHTML = ''; // Clear previous rendering

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const createFace = (vertices, color, transparent = false, opacity = 1.0) => {
        const geometry = new THREE.BufferGeometry();
        const vertexArray = new Float32Array(vertices.flat());
        geometry.setAttribute('position', new THREE.BufferAttribute(vertexArray, 3));
        geometry.setIndex([0, 1, 2]);
        geometry.computeVertexNormals();
        const material = new THREE.MeshPhongMaterial({ color, transparent, opacity, side: THREE.DoubleSide, depthTest: false, depthWrite: false });
        return new THREE.Mesh(geometry, material);
    };

    // Define the vertices for each face of the pyramid
    const faces = [
        { vertices: [[-width / 2, 0, -depth / 2], [width / 2, 0, -depth / 2], [0, height, 0]], color: 0xff0000, transparent: true, opacity: 0.5 }, // Front face
        { vertices: [[width / 2, 0, -depth / 2], [width / 2, 0, depth / 2], [0, height, 0]], color: 0x00ff00 }, // Right face
        { vertices: [[width / 2, 0, depth / 2], [-width / 2, 0, depth / 2], [0, height, 0]], color: 0x0000ff }, // Back face
        { vertices: [[-width / 2, 0, depth / 2], [-width / 2, 0, -depth / 2], [0, height, 0]], color: 0xffff00 } // Left face
    ];

    faces.forEach(face => {
        const mesh = createFace(face.vertices, face.color, face.transparent, face.opacity);
        scene.add(mesh);
    });

    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    camera.position.z = 2 * Math.max(width, depth, height);
    camera.position.y = height / 2;
    camera.lookAt(new THREE.Vector3(0, height / 2, 0));

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;

    const animate = function () {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    };

    animate();
}

drawPyramid(1, 1, 1); // Initial rendering with default dimensions
