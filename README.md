# 🏎️ City Drift - Mobile 3D Driving Game

A fun, colorful, and addictive mobile-friendly 3D driving game built with Three.js. Features smooth driving mechanics, AI traffic, dynamic missions, a fully functional garage system, and beautiful day/night cycles.

## 🎮 Features

### Core Gameplay
- **Smooth Driving Controls**: Realistic physics-based vehicle handling with acceleration, braking, and hand brake
- **20+ Unlockable Cars**: From economy cars to powerful supercars, each with unique stats
- **AI Traffic System**: 12+ AI vehicles (cars, buses, trucks) that navigate the city autonomously
- **Dynamic Missions**: Complete various mission types to earn cash

### Game World
- **Colorful Open City**: Grid-based road system with buildings, street lights, and landmarks
- **Gas Stations**: Refuel your car (cost-based system)
- **Parking Areas**: Park correctly to complete parking missions
- **Day/Night Cycle**: Automatic lighting changes throughout the game session
- **Weather System**: Dynamic environment with seasonal variations

### Garage & Customization
- **Vehicle Purchase System**: Buy new cars with earned cash
- **Car Statistics**: Each vehicle has unique speed and handling characteristics
- **Persistent Saves**: Your progress is automatically saved to localStorage
- **Visual Variety**: 10 different colored and styled vehicles to choose from

### Mission Types
1. **Delivery Rush**: Drive a package to a marked location
2. **Pickup Service**: Transport a passenger safely
3. **Perfect Park**: Park in a designated parking space
4. **Speed Racer**: Reach a checkpoint before time expires
5. **Safe Driver**: Complete a lap without crashing

### User Interface
- **HUD Display**: Real-time speed, fuel, cash, and damage indicators
- **Minimap**: See your position and mission targets
- **Mission Tracker**: Current objective and progress bar
- **Game Over Screen**: Mission results and statistics
- **Main Menu**: Easy navigation between game states

### Camera Modes
- **Third-Person**: Traditional chase camera for exploration
- **Cockpit**: First-person driver view for immersion
- **Toggle with 'C' key**

## 🎮 Controls

| Key | Action |
|-----|--------|
| ⬆️/W | Accelerate |
| ⬇️/S | Brake/Reverse |
| ⬅️/A | Turn Left |
| ➡️/D | Turn Right |
| SPACE | Hand Brake (drift) |
| C | Change Camera |
| G | Open Garage |
| F | Refuel Car |
| M | Show Missions |

## 🚀 Getting Started

### Quick Play (No Installation)
1. Simply open `index.html` in your web browser
2. Click "Play" to start the game
3. Use keyboard controls to drive
4. Complete missions to earn money
5. Buy new cars from the Garage

### Online Play
The game is deployed and playable at:
```
https://OBADASAHHARY.github.io/city-drift-game/
```

## 📱 Mobile Optimization
- Responsive UI that adapts to screen sizes
- Touch controls support (future update)
- Optimized rendering for lower-end devices
- Reduced polygon count for smooth performance

## 🏆 Earning & Progression

### Currency System
- **Starting Cash**: $1,000
- **Mission Rewards**: $300-$600 per mission
- **Costs**: 
  - Fuel: $5 per 1% of tank
  - Damage: $50 per collision
  - Car Purchase: $5,000-$45,000

### Car Progression
1. **Starter**: City Runner (free) - Good for learning
2. **Early**: Swift Sedan, Urban SUV ($5,000-$20,000)
3. **Mid-Tier**: Sport Racer, Electric Pro ($15,000-$18,000)
4. **High-End**: Turbo Beast, Luxury Sedan ($25,000-$45,000)

## 🎨 Graphics & Performance

### Rendering
- Three.js WebGL renderer with shadow mapping
- Dynamic lighting system
- Real-time weather effects
- Optimized for 60 FPS on most devices

### Visual Features
- Realistic car models with 4 wheels
- Transparent windows and reflections
- Building variety with different colors
- Street lights and environmental details
- Minimap with real-time vehicle tracking

## 💾 Save System

Game progress is automatically saved to browser localStorage:
- Current cash amount
- Owned vehicles
- Selected car
- Mission progress

Data persists between sessions unless browser cache is cleared.

## 🔧 Technical Details

### Technology Stack
- **Three.js**: 3D graphics and rendering
- **HTML5/CSS3**: UI and styling
- **JavaScript ES6+**: Game logic and physics
- **WebGL**: Hardware-accelerated graphics

### Physics
- Simple but effective acceleration/deceleration model
- Friction simulation for realistic handling
- Collision detection with traffic and buildings
- Boundary system to keep vehicles in city limits

### Performance Optimizations
- Efficient object pooling for traffic
- Shadow map optimization
- Culling of off-screen objects
- Minimized texture usage

## 🎯 Future Enhancements

- [ ] Touch/Mobile controls
- [ ] Sound effects and music
- [ ] More mission types and challenges
- [ ] Multiplayer leaderboards
- [ ] Vehicle customization (paint jobs, upgrades)
- [ ] More detailed city areas
- [ ] Traffic lights and pedestrians
- [ ] Damage effects and car destruction
- [ ] Achievements and daily challenges
- [ ] Different weather effects (rain physics)

## 📄 License

MIT License - Feel free to use, modify, and distribute!

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Create issues

## 📚 Learning Resources

This project is a great example for learning:
- Three.js fundamentals
- Game loop implementation
- Physics simulation
- State management
- Browser storage APIs
- Responsive web design

## 📞 Support

For issues or questions:
1. Check the README
2. Open a GitHub issue
3. Review the code comments

---

**Enjoy City Drift! 🏎️💨**