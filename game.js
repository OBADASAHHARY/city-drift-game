// City Drift - Complete 3D Mobile Driving Game
// Features: AI Traffic, Missions, Garage, Weather, Day/Night Cycle, and more

class CityDriftGame {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
        this.renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
        this.renderer.setClearColor(0x87ceeb);

        // Game State
        this.gameState = 'MENU';
        this.player = null;
        this.city = null;
        this.traffic = [];
        this.missions = [];
        this.currentMission = null;
        this.isNight = false;
        this.weatherState = 'sunny';
        this.timeOfDay = 0;
        this.cash = 1000;
        this.garageOpen = false;

        // Input handling
        this.keys = {};
        this.setupInputHandlers();

        // Vehicle data
        this.cars = [
            { id: 0, name: 'City Runner', price: 0, color: 0x00ff00, speed: 180, handling: 0.8, owned: true },
            { id: 1, name: 'Swift Sedan', price: 5000, color: 0xff0000, speed: 200, handling: 0.75, owned: false },
            { id: 2, name: 'Sport Racer', price: 15000, color: 0xffaa00, speed: 280, handling: 0.9, owned: false },
            { id: 3, name: 'Muscle Car', price: 25000, color: 0xff6600, speed: 320, handling: 0.8, owned: false },
            { id: 4, name: 'Urban SUV', price: 20000, color: 0x663333, speed: 220, handling: 0.7, owned: false },
            { id: 5, name: 'Electric Pro', price: 18000, color: 0x00aaff, speed: 260, handling: 0.85, owned: false },
            { id: 6, name: 'Luxury Sedan', price: 30000, color: 0xffff00, speed: 240, handling: 0.75, owned: false },
            { id: 7, name: 'Turbo Beast', price: 45000, color: 0xff0066, speed: 340, handling: 0.88, owned: false },
            { id: 8, name: 'Sleek Coupe', price: 22000, color: 0x0066ff, speed: 270, handling: 0.9, owned: false },
            { id: 9, name: 'Off-Road King', price: 35000, color: 0x00dd00, speed: 230, handling: 0.7, owned: false },
        ];
        this.selectedCarId = 0;
        this.loadGameData();
        this.setupScene();
    }

    setupInputHandlers() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            if (e.key === 'c' || e.key === 'C') this.toggleCamera();
            if (e.key === 'g' || e.key === 'G') this.toggleGarage();
            if (e.key === 'f' || e.key === 'F') this.refuelCar();
            if (e.key === 'm' || e.key === 'M') this.showMissions();
        });
        window.addEventListener('keyup', (e) => { this.keys[e.key.toLowerCase()] = false; });
        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupScene() {
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(100, 200, 100);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.far = 1000;
        directionalLight.shadow.camera.left = -500;
        directionalLight.shadow.camera.right = 500;
        directionalLight.shadow.camera.top = 500;
        directionalLight.shadow.camera.bottom = -500;
        this.scene.add(directionalLight);
        this.sunLight = directionalLight;

        // Sky
        const skyGeometry = new THREE.SphereGeometry(2000, 32, 32);
        const skyMaterial = new THREE.MeshBasicMaterial({ color: 0x87ceeb });
        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        this.scene.add(sky);
        this.sky = sky;

        // Create City
        this.createCity();

        // Create Player Car
        this.createPlayerCar();

        // Create AI Traffic
        this.spawnTraffic();

        // Create Missions
        this.createMissions();
    }

    createCity() {
        this.city = {
            roads: [],
            buildings: [],
            lights: [],
            gasStations: [],
            parkings: []
        };

        // Main roads (grid pattern)
        for (let x = -400; x <= 400; x += 100) {
            const roadGeom = new THREE.PlaneGeometry(1000, 30);
            const roadMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
            const road = new THREE.Mesh(roadGeom, roadMat);
            road.rotation.x = -Math.PI / 2;
            road.position.set(x, 0, 0);
            road.receiveShadow = true;
            this.scene.add(road);
            this.city.roads.push(road);
        }

        for (let z = -400; z <= 400; z += 100) {
            const roadGeom = new THREE.PlaneGeometry(30, 1000);
            const roadMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
            const road = new THREE.Mesh(roadGeom, roadMat);
            road.rotation.x = -Math.PI / 2;
            road.position.set(0, 0, z);
            road.receiveShadow = true;
            this.scene.add(road);
            this.city.roads.push(road);
        }

        // Road markings
        const markingMat = new THREE.MeshLambertMaterial({ color: 0xffff00 });
        for (let x = -400; x <= 400; x += 100) {
            const markGeom = new THREE.PlaneGeometry(1000, 2);
            const mark = new THREE.Mesh(markGeom, markingMat);
            mark.rotation.x = -Math.PI / 2;
            mark.position.set(x, 0.01, 0);
            this.scene.add(mark);
        }

        // Buildings
        const buildingColors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0xf7b731, 0x5f27cd];
        for (let x = -500; x <= 500; x += 120) {
            for (let z = -500; z <= 500; z += 120) {
                if (Math.abs(x) < 100 || Math.abs(z) < 100) continue;
                const height = Math.random() * 150 + 50;
                const buildingGeom = new THREE.BoxGeometry(80, height, 80);
                const buildingMat = new THREE.MeshPhongMaterial({ color: buildingColors[Math.floor(Math.random() * buildingColors.length)] });
                const building = new THREE.Mesh(buildingGeom, buildingMat);
                building.position.set(x, height / 2, z);
                building.castShadow = true;
                building.receiveShadow = true;
                this.scene.add(building);
                this.city.buildings.push(building);
            }
        }

        // Street lights
        for (let x = -400; x <= 400; x += 80) {
            for (let z = -400; z <= 400; z += 80) {
                const lightGeom = new THREE.CylinderGeometry(2, 2, 30, 8);
                const lightMat = new THREE.MeshPhongMaterial({ color: 0x444444 });
                const pole = new THREE.Mesh(lightGeom, lightMat);
                pole.position.set(x, 15, z);
                pole.castShadow = true;
                this.scene.add(pole);
            }
        }

        // Gas stations
        for (let i = 0; i < 3; i++) {
            const gasX = (Math.random() - 0.5) * 700;
            const gasZ = (Math.random() - 0.5) * 700;
            const gasStation = new THREE.Group();
            const pumpGeom = new THREE.BoxGeometry(15, 20, 15);
            const pumpMat = new THREE.MeshPhongMaterial({ color: 0xff6600 });
            const pump = new THREE.Mesh(pumpGeom, pumpMat);
            pump.position.y = 10;
            pump.castShadow = true;
            gasStation.add(pump);
            gasStation.position.set(gasX, 0, gasZ);
            gasStation.userData = { type: 'gasStation' };
            this.scene.add(gasStation);
            this.city.gasStations.push(gasStation);
        }

        // Parking areas
        for (let i = 0; i < 4; i++) {
            const parkX = (Math.random() - 0.5) * 600;
            const parkZ = (Math.random() - 0.5) * 600;
            const parkingGeom = new THREE.PlaneGeometry(100, 80);
            const parkingMat = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
            const parking = new THREE.Mesh(parkingGeom, parkingMat);
            parking.rotation.x = -Math.PI / 2;
            parking.position.set(parkX, 0.02, parkZ);
            parking.userData = { type: 'parking' };
            this.scene.add(parking);
            this.city.parkings.push(parking);
        }
    }

    createPlayerCar() {
        const carData = this.cars[this.selectedCarId];
        const carGroup = new THREE.Group();
        carGroup.userData = { type: 'player' };

        // Car body
        const bodyGeom = new THREE.BoxGeometry(20, 10, 40);
        const bodyMat = new THREE.MeshPhongMaterial({ color: carData.color });
        const body = new THREE.Mesh(bodyGeom, bodyMat);
        body.castShadow = true;
        body.receiveShadow = true;
        carGroup.add(body);

        // Windows
        const windowGeom = new THREE.BoxGeometry(18, 6, 8);
        const windowMat = new THREE.MeshPhongMaterial({ color: 0x87ceeb, transparent: true, opacity: 0.6 });
        const frontWindow = new THREE.Mesh(windowGeom, windowMat);
        frontWindow.position.set(0, 3, -10);
        carGroup.add(frontWindow);

        // Wheels
        const wheelGeom = new THREE.CylinderGeometry(6, 6, 8, 16);
        const wheelMat = new THREE.MeshPhongMaterial({ color: 0x222222 });
        for (let i = 0; i < 4; i++) {
            const wheel = new THREE.Mesh(wheelGeom, wheelMat);
            wheel.rotation.z = Math.PI / 2;
            wheel.castShadow = true;
            const isLeft = i % 2 === 0;
            const isFront = i < 2;
            wheel.position.set(isLeft ? -12 : 12, 8, isFront ? -15 : 15);
            carGroup.add(wheel);
        }

        carGroup.position.set(0, 10, 0);
        carGroup.scale.set(0.8, 0.8, 0.8);
        this.scene.add(carGroup);

        this.player = {
            object: carGroup,
            velocity: new THREE.Vector3(0, 0, 0),
            speed: 0,
            maxSpeed: carData.speed,
            acceleration: 0.3,
            friction: 0.05,
            handling: carData.handling,
            rotationSpeed: 0.08,
            fuel: 100,
            damage: 0,
            cameraMode: 0,
            money: this.cash
        };
    }

    spawnTraffic() {
        const trafficCount = 12;
        const trafficColors = [0xff0000, 0xffff00, 0x0000ff, 0x00ff00, 0xff00ff];
        const trafficTypes = [
            { name: 'Car', speed: 120, color: trafficColors[0] },
            { name: 'Taxi', speed: 100, color: 0xffff00 },
            { name: 'Bus', speed: 80, scale: 1.5, color: 0xff0000 },
            { name: 'Truck', speed: 100, scale: 1.3, color: 0x8b4513 }
        ];

        for (let i = 0; i < trafficCount; i++) {
            const type = trafficTypes[Math.floor(Math.random() * trafficTypes.length)];
            const x = (Math.random() - 0.5) * 600;
            const z = (Math.random() - 0.5) * 600;
            const direction = Math.random() * Math.PI * 2;

            const carGroup = new THREE.Group();
            const bodyGeom = new THREE.BoxGeometry(16, 8, 32);
            const bodyMat = new THREE.MeshPhongMaterial({ color: type.color });
            const body = new THREE.Mesh(bodyGeom, bodyMat);
            body.castShadow = true;
            carGroup.add(body);

            const wheelGeom = new THREE.CylinderGeometry(5, 5, 6, 16);
            const wheelMat = new THREE.MeshPhongMaterial({ color: 0x222222 });
            for (let j = 0; j < 4; j++) {
                const wheel = new THREE.Mesh(wheelGeom, wheelMat);
                wheel.rotation.z = Math.PI / 2;
                const isLeft = j % 2 === 0;
                const isFront = j < 2;
                wheel.position.set(isLeft ? -10 : 10, 6, isFront ? -12 : 12);
                carGroup.add(wheel);
            }

            carGroup.position.set(x, 8, z);
            carGroup.rotation.y = direction;
            carGroup.scale.set(type.scale || 1, type.scale || 1, type.scale || 1);
            this.scene.add(carGroup);

            this.traffic.push({
                object: carGroup,
                velocity: new THREE.Vector3(0, 0, 0),
                speed: 0,
                maxSpeed: type.speed,
                direction: direction,
                rotationSpeed: 0.05,
                AI: true,
                waypoint: new THREE.Vector3(x + Math.cos(direction) * 200, 8, z + Math.sin(direction) * 200),
                type: type.name
            });
        }
    }

    createMissions() {
        this.missions = [
            {
                id: 0,
                title: 'Delivery Rush',
                description: 'Deliver the package to the marked location',
                target: new THREE.Vector3(300, 0, 300),
                type: 'delivery',
                reward: 500,
                timeLimit: 120,
                completed: false
            },
            {
                id: 1,
                title: 'Pickup Service',
                description: 'Pick up a passenger and drive them safely',
                target: new THREE.Vector3(-250, 0, 250),
                type: 'passenger',
                reward: 400,
                timeLimit: 150,
                completed: false
            },
            {
                id: 2,
                title: 'Perfect Park',
                description: 'Park your car in the marked space',
                target: this.city.parkings[0]?.position || new THREE.Vector3(0, 0, 0),
                type: 'parking',
                reward: 300,
                timeLimit: 90,
                completed: false
            },
            {
                id: 3,
                title: 'Speed Racer',
                description: 'Reach the checkpoint before time runs out',
                target: new THREE.Vector3(-300, 0, -300),
                type: 'checkpoint',
                reward: 600,
                timeLimit: 100,
                completed: false
            },
            {
                id: 4,
                title: 'Safe Driver',
                description: 'Complete a lap without crashing. Avoid traffic!',
                target: new THREE.Vector3(0, 0, 0),
                type: 'safe',
                reward: 550,
                timeLimit: 180,
                completed: false
            }
        ];
    }

    startGame() {
        document.getElementById('mainMenu').classList.add('hidden');
        this.gameState = 'PLAYING';
        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.gameState !== 'PLAYING') {
            this.renderer.render(this.scene, this.camera);
            return;
        }

        this.updatePlayer();
        this.updateTraffic();
        this.updateWeather();
        this.updateCamera();
        this.updateHUD();
        this.updateMission();
        this.checkCollisions();
        this.checkMissionCompletion();

        this.renderer.render(this.scene, this.camera);
    }

    updatePlayer() {
        if (!this.player) return;

        const accel = this.keys['arrowup'] ? 1 : this.keys['w'] ? 1 : 0;
        const decel = this.keys['arrowdown'] ? 1 : this.keys['s'] ? 1 : 0;
        const left = this.keys['arrowleft'] ? 1 : this.keys['a'] ? 1 : 0;
        const right = this.keys['arrowright'] ? 1 : this.keys['d'] ? 1 : 0;
        const handbrake = this.keys[' '] ? 1 : 0;

        this.player.speed += (accel - decel) * this.player.acceleration;
        this.player.speed = Math.max(-100, Math.min(this.player.speed, this.player.maxSpeed));
        this.player.speed *= (1 - this.player.friction);

        if (this.player.speed > 1) {
            this.player.object.rotation.y += (left - right) * this.player.rotationSpeed * (this.player.handling + 0.2);
        }

        if (accel > 0) this.player.fuel -= 0.02;
        this.player.fuel = Math.max(0, this.player.fuel);

        if (this.player.fuel <= 0) {
            this.player.speed *= 0.98;
        }

        const direction = new THREE.Vector3(0, 0, this.player.speed);
        direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.player.object.rotation.y);
        this.player.object.position.add(direction);

        this.player.object.position.x = Math.max(-450, Math.min(450, this.player.object.position.x));
        this.player.object.position.z = Math.max(-450, Math.min(450, this.player.object.position.z));
    }

    updateTraffic() {
        this.traffic.forEach(car => {
            if (car.AI) {
                const toWaypoint = car.waypoint.clone().sub(car.object.position);
                if (toWaypoint.length() < 50) {
                    car.waypoint.set(
                        (Math.random() - 0.5) * 800,
                        0,
                        (Math.random() - 0.5) * 800
                    );
                }

                toWaypoint.normalize();
                car.direction = Math.atan2(toWaypoint.x, toWaypoint.z);
                car.object.rotation.y = car.direction;
                car.speed = car.maxSpeed * 0.6;

                const direction = new THREE.Vector3(0, 0, car.speed);
                direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), car.object.rotation.y);
                car.object.position.add(direction);

                car.object.position.x = Math.max(-450, Math.min(450, car.object.position.x));
                car.object.position.z = Math.max(-450, Math.min(450, car.object.position.z));
            }
        });
    }

    updateWeather() {
        this.timeOfDay += 0.0001;
        const cycleTime = this.timeOfDay % 1;

        if (cycleTime > 0.3 && cycleTime < 0.7) {
            this.isNight = false;
            this.scene.fog = null;
        } else {
            this.isNight = true;
        }

        const sunAngle = cycleTime * Math.PI * 2;
        this.sunLight.position.set(
            Math.cos(sunAngle) * 300,
            Math.sin(sunAngle) * 300 + 100,
            100
        );

        if (this.isNight) {
            this.scene.background.setHex(0x1a1a2e);
            this.sky.material.color.setHex(0x1a1a2e);
        } else {
            this.scene.background.setHex(0x87ceeb);
            this.sky.material.color.setHex(0x87ceeb);
        }
    }

    updateCamera() {
        if (!this.player) return;

        const pos = this.player.object.position;
        const cameraDistance = this.player.cameraMode === 0 ? 60 : 0;
        const cameraHeight = this.player.cameraMode === 0 ? 30 : 8;
        const targetX = pos.x - Math.sin(this.player.object.rotation.y) * cameraDistance;
        const targetZ = pos.z - Math.cos(this.player.object.rotation.y) * cameraDistance;

        this.camera.position.x += (targetX - this.camera.position.x) * 0.1;
        this.camera.position.y += (pos.y + cameraHeight - this.camera.position.y) * 0.1;
        this.camera.position.z += (targetZ - this.camera.position.z) * 0.1;
        this.camera.lookAt(pos.x, pos.y + 5, pos.z);
    }

    updateHUD() {
        if (!this.player) return;
        document.getElementById('speedValue').textContent = Math.round(Math.abs(this.player.speed));
        document.getElementById('fuelValue').textContent = Math.round(this.player.fuel);
        document.getElementById('cashValue').textContent = Math.round(this.player.money);
        document.getElementById('damageValue').textContent = Math.round(this.player.damage);
    }

    updateMission() {
        if (!this.currentMission) return;
        const mission = this.currentMission;
        const dist = this.player.object.position.distanceTo(mission.target);
        const progress = Math.min(1, 1 - dist / 500);
        document.getElementById('missionProgressBar').style.width = (progress * 100) + '%';
        document.getElementById('missionTitle').textContent = mission.title.toUpperCase();
        document.getElementById('missionDesc').textContent = mission.description + ` (${Math.round(dist)}m)`;
    }

    checkCollisions() {
        if (!this.player) return;

        this.traffic.forEach(car => {
            const dist = this.player.object.position.distanceTo(car.object.position);
            if (dist < 30) {
                this.player.damage += 10;
                this.player.speed *= 0.5;
                this.player.money -= 50;
            }
        });
    }

    checkMissionCompletion() {
        if (!this.currentMission || !this.player) return;
        const dist = this.player.object.position.distanceTo(this.currentMission.target);
        if (dist < 40) {
            this.completeMission();
        }
    }

    completeMission() {
        const reward = this.currentMission.reward;
        this.player.money += reward;
        this.cash += reward;
        this.currentMission.completed = true;
        this.showGameOver(true);
    }

    toggleCamera() {
        if (!this.player) return;
        this.player.cameraMode = (this.player.cameraMode + 1) % 2;
    }

    toggleGarage() {
        if (this.gameState === 'PLAYING') {
            this.gameState = 'PAUSED';
            this.openGarage();
        }
    }

    openGarage() {
        document.getElementById('garageMenu').classList.add('show');
        document.getElementById('walletDisplay').textContent = this.cash;
        this.populateGarage();
        this.garageOpen = true;
    }

    populateGarage() {
        const garageContent = document.getElementById('garageContent');
        garageContent.innerHTML = '';

        this.cars.forEach(car => {
            const card = document.createElement('div');
            card.className = 'car-card';
            if (car.owned) card.classList.add('owned');
            if (car.id === this.selectedCarId && car.owned) card.classList.add('selected');

            card.innerHTML = `
                <div class="car-name">${car.name}</div>
                <div class="car-price">${car.owned ? '✓ Owned' : '$' + car.price}</div>
                <div class="car-status">Speed: ${car.speed}</div>
            `;

            card.onclick = () => {
                if (!car.owned) {
                    if (this.cash >= car.price) {
                        this.cash -= car.price;
                        car.owned = true;
                        document.getElementById('walletDisplay').textContent = this.cash;
                        this.populateGarage();
                    }
                } else {
                    this.selectedCarId = car.id;
                    this.recreatePlayerCar();
                    this.populateGarage();
                }
            };

            garageContent.appendChild(card);
        });
    }

    recreatePlayerCar() {
        if (this.player?.object) {
            this.scene.remove(this.player.object);
        }
        this.createPlayerCar();
    }

    closeGarage() {
        document.getElementById('garageMenu').classList.remove('show');
        this.gameState = 'PLAYING';
        this.garageOpen = false;
        this.saveGameData();
    }

    refuelCar() {
        if (this.player && this.player.fuel < 100) {
            const cost = (100 - this.player.fuel) * 5;
            if (this.player.money >= cost) {
                const gasPump = document.getElementById('gasPump');
                gasPump.classList.add('show');
                this.player.money -= cost;
                this.player.fuel = 100;
                setTimeout(() => gasPump.classList.remove('show'), 2000);
            }
        }
    }

    showMissions() {
        if (!this.currentMission) {
            this.currentMission = this.missions[Math.floor(Math.random() * this.missions.length)];
        }
    }

    showAchievements() {
        alert('Achievements:\n- Complete 5 missions\n- Earn $10,000\n- Collect all cars\n- Drive at 300 km/h');
    }

    showGameOver(success) {
        this.gameState = 'PAUSED';
        const screen = document.getElementById('gameOverScreen');
        const title = document.getElementById('gameOverTitle');
        const stats = document.getElementById('gameOverStats');

        if (success) {
            title.textContent = '✓ Mission Complete!';
            title.classList.add('success');
            stats.innerHTML = `
                <div class="stat-line">Reward: <span class="stat-value">$${this.currentMission.reward}</span></div>
                <div class="stat-line">Total: <span class="stat-value">$${this.player.money}</span></div>
            `;
        } else {
            title.textContent = 'Mission Failed';
            title.classList.remove('success');
            stats.innerHTML = `
                <div class="stat-line">Damage: <span class="stat-value">${Math.round(this.player.damage)}%</span></div>
            `;
        }

        screen.classList.add('show');
    }

    retryMission() {
        document.getElementById('gameOverScreen').classList.remove('show');
        this.player.object.position.set(0, 10, 0);
        this.player.speed = 0;
        this.player.damage = 0;
        this.gameState = 'PLAYING';
    }

    goToMenu() {
        document.getElementById('gameOverScreen').classList.remove('show');
        document.getElementById('mainMenu').classList.remove('hidden');
        this.gameState = 'MENU';
    }

    saveGameData() {
        const data = {
            cash: this.cash,
            selectedCarId: this.selectedCarId,
            cars: this.cars.map(c => ({ id: c.id, owned: c.owned }))
        };
        localStorage.setItem('cityDriftSave', JSON.stringify(data));
    }

    loadGameData() {
        const saved = localStorage.getItem('cityDriftSave');
        if (saved) {
            const data = JSON.parse(saved);
            this.cash = data.cash;
            this.selectedCarId = data.selectedCarId;
            data.cars.forEach(c => {
                const car = this.cars.find(car => car.id === c.id);
                if (car) car.owned = c.owned;
            });
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

const game = new CityDriftGame();