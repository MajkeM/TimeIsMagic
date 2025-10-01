import { useEffect, useState, useRef } from "react";
import "../../responsive.css";
import playerSprite from "../Sprites/player.png";
import gameBackround from "../Sprites/backgroun-cartoon-top-view-2D.png";
import goblinSprite from "../Sprites/goblinSprite.png";
import bulletSprite from "../Sprites/playerBullet.png";
import goblinBulletSprite from "../Sprites/rockSprite.png";
import stoneSprite from "../Sprites/stoneSprite.png";
import reloadAbility from "../Sprites/reload-ability.png";
import flashAbility from "../Sprites/flash-ability.png";
import teleportAbility from "../Sprites/teleport-ability.png";
import splashAbility from "../Sprites/splash-ability.png";
import speedAbility from "../Sprites/speed-ability.png";
import abilityBackground from "../Sprites/ability-background.png";
import scoreBackground from "../Sprites/score-background.png";

import { Link } from "react-router-dom";


export default function GameCanvas({showCollision, R_ability, F_ability, T_ability}) {

    // canvas 
        // ability icons 
            const ICON_SIZE = 100;
            const ICON_MARGIN = 80;
        // ability backgrounds
            const ABILITY_BACKGROUND_SIZE = 1000;
            const ABILITY_BACKGROUND_MARGIN = -25;


    // Abilities
        const abilityBackgroundImageRef = useRef(null);
    // score
        const scoreBackgroundImageRef = useRef(null);


        // Teleport ability
        const TELEPORT_COOLDOWN = 10000;
        const TELEPORT_ABILITY = true;
        const TELEPORT_DURATION = 100; // in ms
        const TELEPORT_DISTANCE = 250; // in pixels

        const teleportAbilityRef = useRef(null);
        const teleportAbilityOnCooldown = useRef(false);
        const teleportAbilityCooldownStartTime = useRef(0);
        const teleportTimeRef = useRef(TELEPORT_COOLDOWN);
        const teleportAbilityActive = useRef(false);
        const teleportAbilityStartTime = useRef(0);

        // Reload ability
        const RELOADTIME = 800;
        const RELOADTIME_ABILITY_BOOST = 100;
        const RELOADTIME_ABILITY_BOOST_DURATION = 5000;
        const RELOADTIME_ABILITY_BOOST_COOLDOWN = 20000;
        const RELOAD_ABILITY = true;

        const abilityOnCooldown = useRef(false); // Přidat cooldown tracking
        const abilityCooldownStartTime = useRef(0); // Track when cooldown started
        const abilityReloadRef = useRef(null);
        const reloadTimeRef = useRef(RELOADTIME); // Přidat reloadTime jako ref

        // Flash ability
        const FLASH_COOLDOWN = 4000;
        const FLASH_ABILITY = true;

        const flashAbilityRef = useRef(null);
        const flashAbilityOnCooldown = useRef(false);
        const flashAbilityCooldownStartTime = useRef(0);
        const flash_distance = 200;
        const flashTimeRef = useRef(FLASH_COOLDOWN);

        // Splash ability
        const SPLASH_COOLDOWN = 8000;
        const SPLASH_DAMAGE_RADIUS = 150;
        const splashAbilityRef = useRef(null);
        const splashAbilityOnCooldown = useRef(false);
        const splashAbilityCooldownStartTime = useRef(0);

        // Speed ability
        const SPEED_COOLDOWN = 15000;
        const SPEED_DURATION = 8000;
        const SPEED_PLAYER_MULTIPLIER = 2.5; // Player becomes 2.5x faster
        const SPEED_ENEMY_MULTIPLIER = 0.3; // Enemies become 30% of original speed
        const speedAbilityRef = useRef(null);
        const speedAbilityOnCooldown = useRef(false);
        const speedAbilityCooldownStartTime = useRef(0);
        const speedAbilityActive = useRef(false);
        const speedAbilityStartTime = useRef(0);

    // Ability configuration helper
    const getAbilityConfig = () => {
        return {
            R: {
                ability: R_ability,
                key: 'r',
                available: R_ability === 'reload' || R_ability === 'splash'
            },
            F: {
                ability: F_ability,
                key: 'f', 
                available: F_ability === 'flash' || F_ability === 'speed'
            },
            T: {
                ability: T_ability,
                key: 't',
                available: T_ability === 'teleport'
            }
        };
    };

    // end abilities

    // constants
    


    const SPAWN_BASIC_ENEMY_TIME = 2000;
    const SPAWN_BASIC_ENEMY_TIME_MIN = 1000;

    const SPAWN_TRIPPLESHOOT_ENEMY_TIME = 10000;
    const SPAWN_TRIPPLESHOOT_ENEMY_TIME_MIN = 5000;

    const TRIPPLESHOOT_ENEMY_BULLET_ANGLE = 0.6 // in radians, 0.2 = 11.46 degrees

    const PLAYER_SPEED = 6;
    const PLAYER_SPEED_SLOW = 1;
    const PLAYER_BULLET_SPEED = 30;
    const PLAYER_BULLET_SPEED_SLOW = 1;
    const PLAYER_COLLISION_RADIUS = 40; // Collision radius for player (180x180 sprite)
    
    const BASIC_ENEMY_SPEED = 4;
    const BASIC_ENEMY_BULLET_SPEED = 20;
    const BASIC_ENEMY_SPEED_SLOW = 1;
    const BASIC_ENEMY_BULLET_SPEED_SLOW = 1.5;

    const GOBLIN_BULLET_SIZE = 125; // Size of goblin bullet sprite (width and height) - zmenšeno z 120
    const GOBLIN_BULLET_RADIUS = 20; // Collision radius for goblin bullets - zmenšeno z 25

    const TRIPPLESHOOT_ENEMY_SPEED = 3.5;
    const TRIPPLESHOOT_ENEMY_BULLET_SPEED = 30;
    const TRIPPLESHOOT_ENEMY_SPEED_SLOW = 1;
    const TRIPPLESHOOT_ENEMY_BULLET_SPEED_SLOW = 1.5;

    // Responsive speed system
    // Base reference: 1920x1080 (common desktop resolution)
    const BASE_WIDTH = 1920;
    const BASE_HEIGHT = 1080;
    
    // Calculate responsive speed multiplier based on screen size
    const getResponsiveSpeedMultiplier = () => {
        const currentWidth = window.innerWidth;
        const currentHeight = window.innerHeight;
        
        // Calculate diagonal ratio for more accurate scaling
        const baseDiagonal = Math.sqrt(BASE_WIDTH * BASE_WIDTH + BASE_HEIGHT * BASE_HEIGHT);
        const currentDiagonal = Math.sqrt(currentWidth * currentWidth + currentHeight * currentHeight);
        const diagonalRatio = currentDiagonal / baseDiagonal;
        
        // Apply some smoothing to prevent extreme speed changes
        // Clamp between 0.5x and 2x speed for reasonable gameplay
        return Math.max(0.5, Math.min(2.0, diagonalRatio));
    };





    // canvas
    const canvasRef = useRef(null);
    const keys = useRef({});
    const mousemove = useRef({x:0, y:0});
    const mouseclick = useRef(false);
    

    //game
    const gameImageBackgroundRef = useRef(null);    

    // player
    const playerRef = useRef({})
    const playerImageRef = useRef(null);
    const bullets = useRef([]);
    const bulletSpeed = useRef(PLAYER_BULLET_SPEED);
    const bulletImageRef = useRef(null);
    const playerSpeed = useRef(PLAYER_SPEED);
    const moving = useRef(false);
    const canShoot = useRef(true);
    const lastShotTime = useRef(0);
    
    

    
    const difficulty = useRef(1);
    const score = useRef(0);

    const previousPosition = useRef({x:0, y:0});

    // basic enemy 
    const basicEnemyRef = useRef([]);
    const basicEnemyBulletsRef = useRef([]);
    const basicEnemySpeed = useRef(BASIC_ENEMY_SPEED);
    const enemyBulletSpeed = useRef(BASIC_ENEMY_BULLET_SPEED);
    const basicEnemyLastSpawnTime = useRef(0);
    const lastSpawnTime = useRef(0);
    const basicEnemySpriteRef = useRef(null);
    const goblinBulletImageRef = useRef(null);

    // tripple shoot enemy
    const trippleShootEnemyRef = useRef([]);
    const trippleShootEnemyBulletsRef = useRef([]);
    const trippleShootEnemySpeed = useRef(TRIPPLESHOOT_ENEMY_SPEED);
    const trippleShootEnemyBulletSpeed = useRef(TRIPPLESHOOT_ENEMY_BULLET_SPEED);
    const trippleShootEnemyLastSpawnTime = useRef(0);
    const lastTrippleShootEnemySpawnTime = useRef(0);
    const stoneImageRef = useRef(null);

    // Use ref for loose state so gameLoop can see updates immediately
    const looseRef = useRef(false);
    const [loose, setLoose] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key.toLowerCase(); // Normalize key to lowercase
            const currentTime = performance.now();
            const abilityConfig = getAbilityConfig();

            // R Ability handler (reload or splash)
            if (key === "r" && abilityConfig.R.available) {
                if (R_ability === 'reload' && !abilityOnCooldown.current) {
                    reloadTimeRef.current = RELOADTIME_ABILITY_BOOST;
                    abilityOnCooldown.current = true;
                    abilityCooldownStartTime.current = currentTime;

                    setTimeout(() => {
                        reloadTimeRef.current = RELOADTIME;
                    }, RELOADTIME_ABILITY_BOOST_DURATION);
                    
                    setTimeout(() => {
                        abilityOnCooldown.current = false;
                    }, RELOADTIME_ABILITY_BOOST_COOLDOWN);
                } else if (R_ability === 'splash' && !splashAbilityOnCooldown.current) {
                    // Splash ability - spawn 15 bullets in different directions from player position
                    const playerCenterX = playerRef.current.x + playerRef.current.width / 2;
                    const playerCenterY = playerRef.current.y + playerRef.current.height / 2;
                    
                    // Create 15 bullets in a circle pattern
                    const bulletCount = 15;
                    const angleStep = (2 * Math.PI) / bulletCount; // 360 degrees divided by 15 bullets
                    
                    for (let i = 0; i < bulletCount; i++) {
                        const angle = i * angleStep;
                        const dirX = Math.cos(angle);
                        const dirY = Math.sin(angle);
                        
                        bullets.current.push({
                            x: playerCenterX - 50, // Offset to center the bullet sprite
                            y: playerCenterY - 50, // Offset to center the bullet sprite
                            dirX: dirX,
                            dirY: dirY,
                            angle: angle,
                            width: 20,
                            height: 20
                        });
                    }
                    
                    splashAbilityOnCooldown.current = true;
                    splashAbilityCooldownStartTime.current = currentTime;
                    
                    setTimeout(() => {
                        splashAbilityOnCooldown.current = false;
                    }, SPLASH_COOLDOWN);
                }
            }

            // T Ability handler (teleport)
            if (key === "t" && abilityConfig.T.available && !teleportAbilityOnCooldown.current) {
                teleportAbilityActive.current = true;
                teleportAbilityStartTime.current = currentTime;
                teleportAbilityOnCooldown.current = true;
                teleportAbilityCooldownStartTime.current = currentTime;
                
                const mousePos = mousemove.current;
                basicEnemyRef.current = basicEnemyRef.current.filter(enemy => {
                    const ex = enemy.x + enemy.width / 2;
                    const ey = enemy.y + enemy.height / 4;
                    const distance = Math.sqrt((ex - mousePos.x) ** 2 + (ey - mousePos.y) ** 2);
                    return distance > TELEPORT_DISTANCE;
                });
                trippleShootEnemyRef.current = trippleShootEnemyRef.current.filter(enemy => {
                    const ex = enemy.x + enemy.width / 2;
                    const ey = enemy.y + enemy.height / 2;
                    const distance = Math.sqrt((ex - mousePos.x) ** 2 + (ey - mousePos.y) ** 2);
                    return distance > TELEPORT_DISTANCE;
                });

                setTimeout(() => {
                    teleportAbilityActive.current = false;
                }, TELEPORT_DURATION);

                setTimeout(() => {
                    teleportAbilityOnCooldown.current = false;
                }, TELEPORT_COOLDOWN);
            }

            // F Ability handler (flash or speed)
            if (key === "f" && abilityConfig.F.available) {
                if (F_ability === 'flash' && !flashAbilityOnCooldown.current) {
                    const playerCenterX = playerRef.current.x + playerRef.current.width / 2;
                    const playerCenterY = playerRef.current.y + playerRef.current.height / 2;
                    
                    const dx = mousemove.current.x - playerCenterX;
                    const dy = mousemove.current.y - playerCenterY;
                    const length = Math.sqrt(dx * dx + dy * dy);
                    
                    if (length > 0) { // Avoid division by zero
                        const dirX = dx / length;
                        const dirY = dy / length;
                        
                        const newX = playerRef.current.x + dirX * flash_distance;
                        const newY = playerRef.current.y + dirY * flash_distance;
                        
                        playerRef.current.x = Math.max(0, Math.min(newX, window.innerWidth - playerRef.current.width));
                        playerRef.current.y = Math.max(0, Math.min(newY, window.innerHeight - playerRef.current.height));
                    }
                    
                    flashAbilityOnCooldown.current = true;
                    flashAbilityCooldownStartTime.current = currentTime;
                    
                    setTimeout(() => {
                        flashAbilityOnCooldown.current = false;
                    }, FLASH_COOLDOWN);
                } else if (F_ability === 'speed' && !speedAbilityOnCooldown.current) {
                    // Speed ability - increase player speed and decrease enemy speeds
                    speedAbilityActive.current = true;
                    speedAbilityStartTime.current = currentTime;
                    speedAbilityOnCooldown.current = true;
                    speedAbilityCooldownStartTime.current = currentTime;
                    
                    // Reset speeds after duration
                    setTimeout(() => {
                        speedAbilityActive.current = false;
                    }, SPEED_DURATION);
                    
                    // Reset cooldown
                    setTimeout(() => {
                        speedAbilityOnCooldown.current = false;
                    }, SPEED_COOLDOWN);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []); // Empty dependency array ensures this runs only once

    
    // tripple shoot enemy bullets (shoots every 5 seconds)
    useEffect(() => {
        const shootTrippleShootEnemyBullets = () => {
            trippleShootEnemyRef.current.forEach((enemy) => {
                // number of bullets to shoot
                const bulletCount = 3;
                // shoot bullets in way like a shotgun
                // calculate angle between bullets towards player
                const dx = (playerRef.current.x + playerRef.current.width / 2) - (enemy.x + enemy.width / 2);
                const dy = (playerRef.current.y + playerRef.current.height / 2) - (enemy.y + enemy.height / 2);
                const length = Math.sqrt(dx * dx + dy * dy);
                const dirX = dx / length;
                const dirY = dy / length;
                // calculate starting angle
                const baseAngle = Math.atan2(dirY, dirX);
                // calculate angle increment
                // spread bullets in angle of TRIPPLESHOOT_ENEMY_BULLET_ANGLE
                // rozložíme střely kolem základního úhlu (-0.1, 0, +0.1 radiánů)
                const angleSpread = TRIPPLESHOOT_ENEMY_BULLET_ANGLE;
                const angleIncrement = angleSpread / (bulletCount - 1);
                const startAngle = baseAngle - angleSpread / 2;

                for (let i = 0; i < bulletCount; i++) {
                    const angle = startAngle + i * angleIncrement;
                    trippleShootEnemyBulletsRef.current.push({
                        x: enemy.x + enemy.width / 2,
                        y: enemy.y + enemy.height / 2,

                        dirX: Math.cos(angle),
                        dirY: Math.sin(angle),
                    });

                }
            });
        };

        const intervalId = setInterval(shootTrippleShootEnemyBullets, 5000);

        return () => clearInterval(intervalId);
    }, []);


    // basic enemy bullets (shoots every 3 seconds)
    useEffect(() => {
        const shootEnemyBullets = () => {
           
                basicEnemyRef.current.forEach((enemy) => {
                const dx = (playerRef.current.x + playerRef.current.width / 2) - (enemy.x + enemy.width / 2);
                const dy = (playerRef.current.y + playerRef.current.height / 2) - (enemy.y + enemy.height / 2);
                const length = Math.sqrt(dx * dx + dy * dy);
                const dirX = dx / length;
                const dirY = dy / length;

                basicEnemyBulletsRef.current.push({
                    x: enemy.x + enemy.width / 2,
                    y: enemy.y + enemy.height / 2,
                    dirX: dirX,
                    dirY: dirY,
                });
            });


               

        };

        const intervalId = setInterval(shootEnemyBullets, 3000);

        return () => clearInterval(intervalId);
    },[]);
    


    // mouse click 
    useEffect(() => {

        

            const handleMouseDown = (e) => {
            if (canShoot.current) {
            // Použít přesně stejné centrum jako collision kruh hráče
            const playerCenterX = playerRef.current.x + playerRef.current.width / 2;
            const playerCenterY = playerRef.current.y + playerRef.current.height / 2;
            
            const dx = mousemove.current.x - playerCenterX;
            const dy = mousemove.current.y - playerCenterY;
            const length = Math.sqrt(dx * dx + dy * dy);
            const dirX = dx / length;
            const dirY = dy / length;
            const bulletAngle = Math.atan2(dy, dx); // Úhel pro rotaci střely
            lastShotTime.current = performance.now();

            bullets.current.push({
                x: playerCenterX - 15, // Bullet startuje ze středu collision kruhu (30px sprite, takže -15 pro střed)
                y: playerCenterY - 15, // Bullet startuje ze středu collision kruhu (30px sprite, takže -15 pro střed)
                dirX: dirX,
                dirY: dirY,
                angle: bulletAngle, // Uložení úhlu pro rotaci
            })
            canShoot.current = false;
            setTimeout(() => {
                canShoot.current = true;
            }, reloadTimeRef.current);
        }
        }



            

        

        window.addEventListener("mousedown", handleMouseDown);

        return () => {
            window.removeEventListener("mousedown", handleMouseDown);
        };

    },[]);
    
    
    // mouse movement
    useEffect(() => {

        const handleMouseMove = (e) => {
            const rect = canvasRef.current.getBoundingClientRect();
            mousemove.current.x = e.clientX - rect.left;
            mousemove.current.y = e.clientY - rect.top;
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };

    },[]);


    //movement
    useEffect(() => {

        const handleKeyDown = (e) => {
            keys.current[e.key] = true;

        };

        const handleKeyUp = (e) => {
            keys.current[e.key] = false;

        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };


    },[]);

    // Load player image
    useEffect(() => {
        const playerImage = new Image();
        playerImage.src = playerSprite; // Use the imported sprite
        playerImage.onload = () => {
            playerImageRef.current = playerImage;
        };
        playerImage.onerror = () => {
            console.error('Failed to load player sprite');
        };
    }, []);

    // load ability background image
    useEffect(() => {
        const abilityBackgroundImage = new Image();
        abilityBackgroundImage.src = abilityBackground; // Use the imported sprite
        abilityBackgroundImage.onload = () => {
            abilityBackgroundImageRef.current = abilityBackgroundImage;
        };
        abilityBackgroundImage.onerror = () => {
            console.error('Failed to load ability background sprite');
        };
    }, []);


    // load flash ability image
    useEffect(() => {
        const flashAbilityImage = new Image();
        flashAbilityImage.src = flashAbility; // Use the imported sprite
        flashAbilityImage.onload = () => {
            flashAbilityRef.current = flashAbilityImage;
        };
        flashAbilityImage.onerror = () => {
            console.error('Failed to load flash ability sprite');
        };
    }, []);

    // load teleport ability image
    useEffect(() => {
        const teleportAbilityImage = new Image();
        teleportAbilityImage.src = teleportAbility; // Use the imported sprite
        teleportAbilityImage.onload = () => {
            teleportAbilityRef.current = teleportAbilityImage;
        };
        teleportAbilityImage.onerror = () => {
            console.error('Failed to load teleport ability sprite');
        };
    }, []);

    // load splash ability image
    useEffect(() => {
        const splashAbilityImage = new Image();
        splashAbilityImage.src = splashAbility; // Use the imported sprite
        splashAbilityImage.onload = () => {
            splashAbilityRef.current = splashAbilityImage;
        };
        splashAbilityImage.onerror = () => {
            console.error('Failed to load splash ability sprite');
        };
    }, []);

    // load speed ability image
    useEffect(() => {
        const speedAbilityImage = new Image();
        speedAbilityImage.src = speedAbility; // Use the imported sprite
        speedAbilityImage.onload = () => {
            speedAbilityRef.current = speedAbilityImage;
        };
        speedAbilityImage.onerror = () => {
            console.error('Failed to load speed ability sprite');
        };
    }, []);


    useEffect(() => {
        const gameImageBackground = new Image();
        gameImageBackground.src = gameBackround; // Use the imported sprite
        gameImageBackground.onload = () => {
            gameImageBackgroundRef.current = gameImageBackground;
        };
        gameImageBackground.onerror = () => {
            console.error('Failed to load game background image');
        };
    }, []);


    useEffect(() => {
        const basicEnemySprite = new Image();
        basicEnemySprite.src = goblinSprite; // Use the imported sprite
        basicEnemySprite.onload = () => {
            basicEnemySpriteRef.current = basicEnemySprite;
        };
        basicEnemySprite.onerror = () => {
            console.error('Failed to load basic enemy sprite');
        };
    }, []);

    useEffect(() => {
        const bulletImage = new Image();
        bulletImage.src = bulletSprite; // Use the imported sprite
        bulletImage.onload = () => {
            bulletImageRef.current = bulletImage;
        };
        bulletImage.onerror = () => {
            console.error('Failed to load bullet sprite');
        };
    }, []);

    useEffect(() => {
        const reloadAbilityImage = new Image();   
        reloadAbilityImage.src = reloadAbility; // Use the imported sprite
        reloadAbilityImage.onload = () => {
            abilityReloadRef.current = reloadAbilityImage;
        };
        reloadAbilityImage.onerror = () => {
            console.error('Failed to load ability sprite');
        };
    }, []);

    // score background
    useEffect(() => {
        const scoreBackgroundImage = new Image();
        scoreBackgroundImage.src = scoreBackground; // Use the imported sprite
        scoreBackgroundImage.onload = () => {
            scoreBackgroundImageRef.current = scoreBackgroundImage;
        };
        scoreBackgroundImage.onerror = () => {
            console.error('Failed to load score background sprite');
        };
    }, []);


    useEffect(() => {
        const goblinBulletImage = new Image();
        goblinBulletImage.src = goblinBulletSprite; // Use the imported sprite
        goblinBulletImage.onload = () => {
            goblinBulletImageRef.current = goblinBulletImage;   
        };
        goblinBulletImage.onerror = () => {
            console.error('Failed to load goblin bullet sprite');
        };
    }, []);

    useEffect(() => {
        const stoneImage = new Image();
        stoneImage.src = stoneSprite; // Use the imported sprite
        stoneImage.onload = () => {
            stoneImageRef.current = stoneImage;
        };
        stoneImage.onerror = () => {
            console.error('Failed to load stone sprite');
        };
    }, []);

    // canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

    let animationFrameId;

    // Function to setup responsive canvas
    const setupCanvas = () => {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        
        // Set canvas size to fill viewport
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        
        // Scale canvas back down using CSS
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        
        // Scale the drawing context so everything draws at the correct size
        ctx.scale(dpr, dpr);
    };

    // Initial setup
    setupCanvas();
    
    // Handle window resize
    const handleResize = () => {
        setupCanvas();
        // Keep player centered on resize
        if (playerRef.current) {
            playerRef.current.x = (window.innerWidth - playerRef.current.width) / 2;
            playerRef.current.y = (window.innerHeight - playerRef.current.height) / 2;
        }
    };
    
    window.addEventListener('resize', handleResize);

    playerRef.current ={
        x: (window.innerWidth - 180) / 2,
        y: (window.innerHeight - 180) / 2,
        width: 180,
        height: 180,
        color: "blue",
        speed: playerSpeed.current,
    };


    const gameLoop = () => {
        const currentTime = performance.now();

        // Helper function for circular collision detection - OPTIMIZED
        const circularCollision = (x1, y1, r1, x2, y2, r2) => {
            const dx = x1 - x2;
            const dy = y1 - y2;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < r1 + r2;
        };

        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background image if loaded
        if (gameImageBackgroundRef.current) {
            ctx.drawImage(gameImageBackgroundRef.current, 0, 0, window.innerWidth, window.innerHeight);
        }
        
        // Calculate rotation angle towards mouse cursor
        const playerCenterX = playerRef.current.x + playerRef.current.width / 2;
        const playerCenterY = playerRef.current.y + playerRef.current.height / 2;
        const dx = mousemove.current.x - playerCenterX; 
        const dy = mousemove.current.y - playerCenterY;
        const baseRotationAngle = Math.atan2(dy, dx);
        
        // Adjust rotation offset to make wizard face cursor correctly
        // Try different values: 0, Math.PI/2, Math.PI, -Math.PI/2
        const rotationOffset = -Math.PI/2; // Adjust this value to fix the facing direction
        const rotationAngle = baseRotationAngle + rotationOffset;
        
        // Draw player - use image if loaded, otherwise fallback to rectangle
        if (playerImageRef.current) {
            // Save the current context state
            ctx.save();
            
            // Move to player center, rotate, then move back
            ctx.translate(playerCenterX, playerCenterY);
            ctx.rotate(rotationAngle);
            
            // Draw the image centered on the rotation point
            ctx.drawImage(
                playerImageRef.current, 
                -playerRef.current.width / 2, 
                -playerRef.current.height / 2, 
                playerRef.current.width, 
                playerRef.current.height
            );
            
            // Restore the context state
            ctx.restore();
        } else {
            ctx.fillStyle = playerRef.current.color;
            ctx.fillRect(playerRef.current.x, playerRef.current.y, playerRef.current.width, playerRef.current.height);
        }

        // Draw player collision boundary (debug visualization)
        if (showCollision) {
            const playerRadius = PLAYER_COLLISION_RADIUS; // Use constant for consistency
            
            ctx.strokeStyle = "rgba(0, 255, 0, 0.5)"; // Semi-transparent green
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(playerCenterX, playerCenterY, playerRadius, 0, 2 * Math.PI);
            ctx.stroke();
        }

        // Draw purple teleport range circle when teleport ability is active
        if (teleportAbilityActive.current) {
            const elapsed = currentTime - teleportAbilityStartTime.current;
            if (elapsed < TELEPORT_DURATION) {
                // Pulsing effect - fade in and out during the duration
                const progress = elapsed / TELEPORT_DURATION;
                const alpha = Math.sin(progress * Math.PI) * 0.6 + 0.2; // Pulsing between 0.2 and 0.8
                
                ctx.strokeStyle = `rgba(128, 0, 128, ${alpha})`; // Purple with pulsing alpha
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(mousemove.current.x, mousemove.current.y, TELEPORT_DISTANCE, 0, 2 * Math.PI);
                ctx.stroke();
                
                // Add a subtle fill for better visibility
                ctx.fillStyle = `rgba(128, 0, 128, ${alpha * 0.1})`; // Very transparent purple fill
                ctx.fill();
            }
        }

        const baseSpawnInterval = SPAWN_BASIC_ENEMY_TIME; 
        const minSpawnInterval = SPAWN_BASIC_ENEMY_TIME_MIN; 

        const trippleShootEnemyBaseSpawnInterval = SPAWN_TRIPPLESHOOT_ENEMY_TIME;
        const trippleShootEnemyMinSpawnInterval = SPAWN_TRIPPLESHOOT_ENEMY_TIME_MIN;
        
        const currentTrippleShootEnemySpawnInterval = trippleShootEnemyBaseSpawnInterval / difficulty.current;
        const trippleShootEnemySpawnInterval = Math.max(trippleShootEnemyMinSpawnInterval, currentTrippleShootEnemySpawnInterval);
        
        if (currentTime - lastTrippleShootEnemySpawnTime.current > trippleShootEnemySpawnInterval) {
            lastTrippleShootEnemySpawnTime.current = currentTime;
            const side = Math.floor(Math.random() * 4);
            let x, y;

            switch (side) {
                case 0: /* top */ x = Math.random() * window.innerWidth; y = 0; break;
                case 1: /* right */ x = window.innerWidth; y = Math.random() * window.innerHeight; break;
                case 2: /* bottom */ x = Math.random() * window.innerWidth; y = window.innerHeight; break;
                case 3: /* left */ x = 0; y = Math.random() * window.innerHeight; break;
            }
            trippleShootEnemyRef.current.push({
                x: x, y: y, width: 100, height: 100, color: "purple",
            });
        }


         const currentSpawnInterval = baseSpawnInterval / difficulty.current;

        // Make sure the interval doesn't go below our minimum
        const spawnInterval = Math.max(minSpawnInterval, currentSpawnInterval);

        if (currentTime - lastSpawnTime.current > spawnInterval) {
                lastSpawnTime.current = currentTime;
                const side = Math.floor(Math.random() * 4);
                let x, y;

                switch (side) {
                    case 0: /* top */ x = Math.random() * window.innerWidth; y = 0; break;
                    case 1: /* right */ x = window.innerWidth; y = Math.random() * window.innerHeight; break;
                    case 2: /* bottom */ x = Math.random() * window.innerWidth; y = window.innerHeight; break;
                    case 3: /* left */ x = 0; y = Math.random() * window.innerHeight; break;
                }
                basicEnemyRef.current.push({
                    x: x, y: y, width: 200, height: 150, color: "red",
                });
        }



        // Update player position based on keys pressed
        if (keys.current["ArrowUp"] || keys.current["w"]){
            playerRef.current.y -= playerRef.current.speed;

        }
        if (keys.current["ArrowDown"] || keys.current["s"]){
            playerRef.current.y += playerRef.current.speed;

        }
        if (keys.current["ArrowLeft"] || keys.current["a"]){
            if (playerRef.current.x > 0){
                playerRef.current.x -= playerRef.current.speed;

            }
        }
        if (keys.current["ArrowRight"] || keys.current["d"]){
            if (playerRef.current.x + playerRef.current.width < window.innerWidth - 22){
                playerRef.current.x += playerRef.current.speed;

            }
        }



        if (previousPosition.current.x === playerRef.current.x && previousPosition.current.y === playerRef.current.y){
            moving.current = false;
        } else {
            moving.current = true;
        }

        previousPosition.current = {x: playerRef.current.x, y: playerRef.current.y};

        // Adjust game speed based on player movement (Time is Magic mechanic)
        // But respect speed ability when it's active
        const responsiveMultiplier = getResponsiveSpeedMultiplier();
        
        if (moving.current) {
            if (speedAbilityActive.current) {
                // Speed ability is active - use boosted speeds with responsive scaling
                playerRef.current.speed = PLAYER_SPEED * SPEED_PLAYER_MULTIPLIER * responsiveMultiplier;
                bulletSpeed.current = PLAYER_BULLET_SPEED * responsiveMultiplier;
                basicEnemySpeed.current = BASIC_ENEMY_SPEED * SPEED_ENEMY_MULTIPLIER * responsiveMultiplier;
                enemyBulletSpeed.current = BASIC_ENEMY_BULLET_SPEED * SPEED_ENEMY_MULTIPLIER * responsiveMultiplier;
                trippleShootEnemySpeed.current = TRIPPLESHOOT_ENEMY_SPEED * SPEED_ENEMY_MULTIPLIER * responsiveMultiplier;
                trippleShootEnemyBulletSpeed.current = TRIPPLESHOOT_ENEMY_BULLET_SPEED * SPEED_ENEMY_MULTIPLIER * responsiveMultiplier;
            } else {
                // Normal speeds when moving with responsive scaling
                playerRef.current.speed = PLAYER_SPEED * responsiveMultiplier;
                bulletSpeed.current = PLAYER_BULLET_SPEED * responsiveMultiplier;
                basicEnemySpeed.current = BASIC_ENEMY_SPEED * responsiveMultiplier;
                enemyBulletSpeed.current = BASIC_ENEMY_BULLET_SPEED * responsiveMultiplier;
                trippleShootEnemySpeed.current = TRIPPLESHOOT_ENEMY_SPEED * responsiveMultiplier;
                trippleShootEnemyBulletSpeed.current = TRIPPLESHOOT_ENEMY_BULLET_SPEED * responsiveMultiplier;
            }
        } else {
            if (speedAbilityActive.current) {
                // Speed ability is active even when not moving with responsive scaling
                playerRef.current.speed = PLAYER_SPEED_SLOW * SPEED_PLAYER_MULTIPLIER * responsiveMultiplier;
                bulletSpeed.current = PLAYER_BULLET_SPEED_SLOW * responsiveMultiplier;
                basicEnemySpeed.current = BASIC_ENEMY_SPEED_SLOW * SPEED_ENEMY_MULTIPLIER * responsiveMultiplier;
                enemyBulletSpeed.current = BASIC_ENEMY_BULLET_SPEED_SLOW * SPEED_ENEMY_MULTIPLIER * responsiveMultiplier;
                trippleShootEnemySpeed.current = TRIPPLESHOOT_ENEMY_SPEED_SLOW * SPEED_ENEMY_MULTIPLIER * responsiveMultiplier;
                trippleShootEnemyBulletSpeed.current = TRIPPLESHOOT_ENEMY_BULLET_SPEED_SLOW * SPEED_ENEMY_MULTIPLIER * responsiveMultiplier;
            } else {
                // Slow speeds when not moving (normal Time is Magic behavior) with responsive scaling
                playerRef.current.speed = PLAYER_SPEED_SLOW * responsiveMultiplier;
                bulletSpeed.current = PLAYER_BULLET_SPEED_SLOW * responsiveMultiplier;
                basicEnemySpeed.current = BASIC_ENEMY_SPEED_SLOW * responsiveMultiplier;
                enemyBulletSpeed.current = BASIC_ENEMY_BULLET_SPEED_SLOW * responsiveMultiplier;
                trippleShootEnemySpeed.current = TRIPPLESHOOT_ENEMY_SPEED_SLOW * responsiveMultiplier;
                trippleShootEnemyBulletSpeed.current = TRIPPLESHOOT_ENEMY_BULLET_SPEED_SLOW * responsiveMultiplier;
            }
        }





        // Draw bullets
        bullets.current.forEach((bullet, index) => {
            bullet.x += bullet.dirX * bulletSpeed.current;
            bullet.y += bullet.dirY * bulletSpeed.current;

            if (bulletImageRef.current) {
                // Otočit střelu podle směru letu - větší velikost
                const bulletSize = 100; // Nová velikost bullet sprite
                ctx.save();
                ctx.translate(bullet.x + bulletSize/2, bullet.y + bulletSize/2); // Střed větší střely
                ctx.rotate(bullet.angle);
                ctx.drawImage(bulletImageRef.current, -bulletSize/2, -bulletSize/2, bulletSize, bulletSize); // Větší bullet ze středu
                ctx.restore();
            } else {
                ctx.beginPath();
                ctx.arc(bullet.x, bullet.y, 10, 0, 2 * Math.PI);
                ctx.fillStyle = "white";
                ctx.fill();
            }

            // Draw bullet collision boundary (debug visualization) - proporcionálně se sprite
            if (showCollision) {
                const bulletSize = 100; // Stejná velikost jako sprite
                const bulletCenterX = bullet.x + bulletSize/2; // Střed podle velikosti sprite (30/2)
                const bulletCenterY = bullet.y + bulletSize/2; // Střed podle velikosti sprite (30/2)  
                const bulletRadius = 15; // Větší collision radius pro větší sprite
                
                ctx.strokeStyle = "rgba(255, 255, 0, 0.6)"; // Semi-transparent yellow
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(bulletCenterX, bulletCenterY, bulletRadius, 0, 2 * Math.PI);
                ctx.stroke();
            }
        })

        // Remove bullets that are out of bounds
        bullets.current = bullets.current.filter((bullet) => {
            return bullet.x >= 0 && bullet.x <= window.innerWidth && bullet.y >= 0 && bullet.y <= window.innerHeight;
        })

        // Draw basic enemies
        basicEnemyRef.current.forEach((enemy, index) => {
            // Move enemy towards player
            const dx = (playerRef.current.x + playerRef.current.width / 2) - (enemy.x + enemy.width / 2);
            const dy = (playerRef.current.y + playerRef.current.height / 2) - (enemy.y + enemy.height / 2);
            const length = Math.sqrt(dx * dx + dy * dy);
            const dirX = dx / length;
            const dirY = dy / length;

            enemy.x += dirX * basicEnemySpeed.current;
            enemy.y += dirY * basicEnemySpeed.current;

            // Calculate collision position on goblin's head instead of center

            const enemyCenterX = enemy.x + enemy.width / 2;  // Střed horizontálně
            const enemyCenterY = enemy.y + enemy.height / 4; // Hlava - čtvrtina z vrchu
            const enemyRotationAngle = Math.atan2(dy, dx);
            const enemyRotationOffset = 1.5; // Přímé otočení čelem k hráči
            const finalEnemyRotation = enemyRotationAngle + enemyRotationOffset;

            if (basicEnemySpriteRef.current) {
                // Save context and rotate enemy sprite
                ctx.save();
                ctx.translate(enemyCenterX, enemyCenterY);
                ctx.rotate(finalEnemyRotation);
                ctx.drawImage(
                    basicEnemySpriteRef.current, 
                    -enemy.width / 2, 
                    -enemy.height / 2, 
                    enemy.width, 
                    enemy.height
                );
                ctx.restore();
            } else {
                ctx.fillStyle = enemy.color;
                ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            }

            // Draw enemy collision boundary (debug visualization) - positioned on head  
            if (showCollision) {
                const enemyRadius = 50; // Větší radius pro hlavu goblina (200x150 sprite)
                ctx.strokeStyle = "rgba(255, 0, 0, 0.4)"; // Semi-transparent red
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(enemyCenterX, enemyCenterY, enemyRadius, 0, 2 * Math.PI);
                ctx.stroke();

                // DEBUG: Zobrazit také střed sprite pro porovnání
                ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"; // Bílý kruh pro střed
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 5, 0, 2 * Math.PI);
                ctx.stroke();
            }
        })

        // draw tripple shoot enemies
        trippleShootEnemyRef.current.forEach((enemy, index) => {
            // Move enemy towards player
            const dx = (playerRef.current.x + playerRef.current.width / 2) - (enemy.x + enemy.width / 2);
            const dy = (playerRef.current.y + playerRef.current.height / 2) - (enemy.y + enemy.height / 2);
            const length = Math.sqrt(dx * dx + dy * dy);
            const dirX = dx / length;
            const dirY = dy / length;

            enemy.x += dirX * trippleShootEnemySpeed.current;
            enemy.y += dirY * trippleShootEnemySpeed.current;

            // Calculate rotation angle towards player (face towards player with feather behind)
            const enemyCenterX = enemy.x + enemy.width / 2;
            const enemyCenterY = enemy.y + enemy.height / 2;
            const enemyRotationAngle = Math.atan2(dy, dx);
            const enemyRotationOffset = 0; // Přímé otočení čelem k hráči
            const finalEnemyRotation = enemyRotationAngle + enemyRotationOffset;

            // Draw triple shoot enemy (currently just rectangle, but prepared for sprite)
            ctx.save();
            ctx.translate(enemyCenterX, enemyCenterY);
            ctx.rotate(finalEnemyRotation);
            if (stoneImageRef.current) {
                ctx.drawImage(
                    stoneImageRef.current,
                    -enemy.width / 2,
                    -enemy.height / 2,
                    enemy.width,
                    enemy.height
                );
            } else {
                ctx.fillStyle = enemy.color;
                ctx.fillRect(-enemy.width / 2, -enemy.height / 2, enemy.width, enemy.height);
            }
            ctx.restore();

            // Draw enemy collision boundary (debug visualization) - smaller than the image
            if (showCollision) {
                const enemyRadius = 25; // Menší radius než obrázek (původně 25)
                ctx.strokeStyle = "rgba(128, 0, 128, 0.4)"; // Semi-transparent purple
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(enemyCenterX, enemyCenterY, enemyRadius, 0, 2 * Math.PI);
                ctx.stroke();
            }
        });

        // Remove enemies that are out of bounds (just in case)
        basicEnemyRef.current = basicEnemyRef.current.filter((enemy) => {
            return enemy.x + enemy.width >= 0 && enemy.x <= window.innerWidth && enemy.y + enemy.height >= 0 && enemy.y <= window.innerHeight;
        })


        // Draw basic enemy bullets
        basicEnemyBulletsRef.current.forEach((bullet, index) => {
            bullet.x += bullet.dirX * enemyBulletSpeed.current;
            bullet.y += bullet.dirY * enemyBulletSpeed.current;

            if (goblinBulletImageRef.current) {
                ctx.drawImage(goblinBulletImageRef.current, bullet.x - GOBLIN_BULLET_SIZE/2, bullet.y - GOBLIN_BULLET_SIZE/2, GOBLIN_BULLET_SIZE, GOBLIN_BULLET_SIZE);
            } else {
                ctx.fillStyle = "red";
                ctx.fillRect(bullet.x - 2, bullet.y - 2, 20, 20);
            }
            
            // Draw bullet collision boundary (debug visualization)
            if (showCollision) {
                const bulletCenterX = bullet.x; // bullet center at bullet position
                const bulletCenterY = bullet.y;
                const bulletRadius = GOBLIN_BULLET_RADIUS; // Use constant for collision radius
                
                ctx.strokeStyle = "rgba(255, 0, 0, 0.3)"; // Semi-transparent red
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(bulletCenterX, bulletCenterY, bulletRadius, 0, 2 * Math.PI);
                ctx.stroke();
            }
        })


        // draw tripple shoot enemy bullets
        trippleShootEnemyBulletsRef.current.forEach((bullet, index) => {
            bullet.x += bullet.dirX * trippleShootEnemyBulletSpeed.current;
            bullet.y += bullet.dirY * trippleShootEnemyBulletSpeed.current;

            if (goblinBulletImageRef.current) {
                // Přidat rotaci pro rock bullet podle směru letu
                const bulletAngle = Math.atan2(bullet.dirY, bullet.dirX);
                const rockBulletSize = 100; // Menší velikost pro triple shoot bullets
                
                ctx.save();
                ctx.translate(bullet.x, bullet.y);
                ctx.rotate(bulletAngle);
                ctx.drawImage(goblinBulletImageRef.current, -rockBulletSize/2, -rockBulletSize/2, rockBulletSize, rockBulletSize);
                ctx.restore();
            } else {
                ctx.fillStyle = "green";
                ctx.fillRect(bullet.x - 2, bullet.y - 2, 20, 20);
            }
            
            // Draw bullet collision boundary (debug visualization)
            if (showCollision) {
                const bulletCenterX = bullet.x;
                const bulletCenterY = bullet.y;
                const bulletRadius = 20; // Collision radius pro triple shoot bullets
                
                ctx.strokeStyle = "rgba(0, 0, 255, 0.3)"; // Semi-transparent blue
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(bulletCenterX, bulletCenterY, bulletRadius, 0, 2 * Math.PI);
                ctx.stroke();
            }
        });
        
        // Remove basic enemy bullets that are out of bounds
        basicEnemyBulletsRef.current = basicEnemyBulletsRef.current.filter((bullet) => {
            return bullet.x >= 0 && bullet.x <= window.innerWidth && bullet.y >= 0 && bullet.y <= window.innerHeight;
        });


        // collision beetwen player and tripple shoot enemy bullets (using circular collision)
        trippleShootEnemyBulletsRef.current.forEach((bullet, index) => {
            const playerCenterX = playerRef.current.x + playerRef.current.width / 2;
            const playerCenterY = playerRef.current.y + playerRef.current.height / 2;
            
            if (circularCollision(playerCenterX, playerCenterY, PLAYER_COLLISION_RADIUS, bullet.x, bullet.y, 10)) {
                trippleShootEnemyBulletsRef.current.splice(index, 1);
                looseRef.current = true;
                setLoose(true);
            }
        });

        // coliision beetwen tripple shoot enemy and player bullets (using circular collision)
        bullets.current.forEach((bullet, bIndex) => {
            trippleShootEnemyRef.current.forEach((enemy, eIndex) => {
                const enemyCenterX = enemy.x + enemy.width / 2;
                const enemyCenterY = enemy.y + enemy.height / 2;
                const bulletCenterX = bullet.x + 15; // Center of 30x30 sprite
                const bulletCenterY = bullet.y + 15;
                
                if (circularCollision(enemyCenterX, enemyCenterY, 15, bulletCenterX, bulletCenterY, 15)) {
                    // Remove both bullet and enemy on collision
                    bullets.current.splice(bIndex, 1);
                    trippleShootEnemyRef.current.splice(eIndex, 1);
                    score.current += 30;
                    difficulty.current += Math.floor(score.current / 100);
                }
            })
        });

        // Collisions between player and basic enemies (goblin collision)
        basicEnemyRef.current.forEach((enemy, index) => {
            const enemyHeadX = enemy.x + enemy.width / 2;
            const enemyHeadY = enemy.y + enemy.height / 4;
            const playerCenterX = playerRef.current.x + playerRef.current.width / 2;
            const playerCenterY = playerRef.current.y + playerRef.current.height / 2;
            
            if (circularCollision(enemyHeadX, enemyHeadY, 50, playerCenterX, playerCenterY, PLAYER_COLLISION_RADIUS)) {
                looseRef.current = true;
                setLoose(true);
            }
        });

        // Collisions between player and triple shoot enemies
        trippleShootEnemyRef.current.forEach((enemy, index) => {
            const enemyCenterX = enemy.x + enemy.width / 2;
            const enemyCenterY = enemy.y + enemy.height / 2;
            const playerCenterX = playerRef.current.x + playerRef.current.width / 2;
            const playerCenterY = playerRef.current.y + playerRef.current.height / 2;
            
            if (circularCollision(playerCenterX, playerCenterY, PLAYER_COLLISION_RADIUS, enemyCenterX, enemyCenterY, 15)) {
                looseRef.current = true;
                setLoose(true);
            }
        });

        // Collisions between player and basic enemy bullets (using circular collision)
        basicEnemyBulletsRef.current.forEach((bullet, index) => {
            const playerCenterX = playerRef.current.x + playerRef.current.width / 2;
            const playerCenterY = playerRef.current.y + playerRef.current.height / 2;
            
            if (circularCollision(playerCenterX, playerCenterY, PLAYER_COLLISION_RADIUS, bullet.x, bullet.y, GOBLIN_BULLET_RADIUS)) {
                basicEnemyBulletsRef.current.splice(index, 1);
                looseRef.current = true;
                setLoose(true);
            }
        })



                // Collisions between player bullets and basic enemies (head collision)
        bullets.current.forEach((bullet, bIndex) => {
            basicEnemyRef.current.forEach((enemy, eIndex) => {
                const enemyHeadX = enemy.x + enemy.width / 2;
                const enemyHeadY = enemy.y + enemy.height / 4;
                const bulletCenterX = bullet.x + 15;
                const bulletCenterY = bullet.y + 15;
                
                if (circularCollision(enemyHeadX, enemyHeadY, 40, bulletCenterX, bulletCenterY, 15)) {
                    bullets.current.splice(bIndex, 1);
                    basicEnemyRef.current.splice(eIndex, 1);
                    score.current += 10;
                    difficulty.current += Math.floor(score.current / 100);
                }
            })
        })

        // collison beetwen enemy bullet and bullet (using circular collision)
        basicEnemyBulletsRef.current.forEach((eBullet, ebIndex) => {
            bullets.current.forEach((bullet, bIndex) => {
                const bulletCenterX = bullet.x + 15;
                const bulletCenterY = bullet.y + 15;
                
                if (circularCollision(eBullet.x, eBullet.y, GOBLIN_BULLET_RADIUS, bulletCenterX, bulletCenterY, 15)) {
                    // Remove both enemy bullet and player bullet on collision
                    basicEnemyBulletsRef.current.splice(ebIndex, 1);
                    bullets.current.splice(bIndex, 1);
                }
            })
        })

        // Responsive text sizing - improved formula
const fontSize = Math.min(window.innerWidth / 40, 24); // Better scaling for readability
const margin = Math.min(window.innerWidth * 0.015, 2); // More proportional margin


// score background image - make it fully responsive
if (scoreBackgroundImageRef.current) {
    // Calculate responsive dimensions based on screen size
    const scoreBgWidth = Math.min(window.innerWidth / 3.5, 400); // More reasonable max width
    const scoreBgHeight = Math.min(window.innerHeight / 3, 400); // Better proportional height
    
    // Position with responsive margins
    const bgX = margin;
    const bgY = margin - 35;
    
    ctx.drawImage(scoreBackgroundImageRef.current, bgX, bgY, scoreBgWidth, scoreBgHeight);
}

// Fix font usage and make text fully responsive
ctx.fillStyle = "white";
ctx.font = `${fontSize}px 'MedievalSharp', cursive`; // Use the font that's actually loaded

// Calculate text positioning relative to background size
const textMarginX = margin + (Math.min(window.innerWidth / 3.5, 400) * 0.35); // 35% inside background
const textMarginY = margin + (Math.min(window.innerHeight / 3, 400) * 0.33); // Start at 45% of background height

// Responsive text positioning
ctx.fillText(`Score: ${score.current}`, textMarginX, textMarginY);
ctx.fillText(`Difficulty: ${difficulty.current}`, textMarginX, textMarginY + (fontSize * 1.5));


       

        if (!canShoot.current) {
            const elapsed = currentTime - lastShotTime.current;
            const progress = Math.min(elapsed / reloadTimeRef.current, 1); // Použít reloadTimeRef.current

            const barWidth = 20;
            const barHeight = 100;
            // Umístit progress bar relativně k centru playera, ne k top-left corner
            const barX = playerCenterX - 100; // Posunout vlevo od středu playera
            const barY = playerCenterY - 40; // Posunout pod playera od středu
            const radius = 5;

            ctx.save();

            ctx.fillStyle = "black";
            drawRoundedRect(ctx, barX, barY, barWidth, barHeight, 5);
            ctx.fill();

            ctx.clip();

            ctx.fillStyle = "orange";
            ctx.fillRect(barX, barY, barWidth, barHeight * progress);

            ctx.restore();
        }

        // Responsive ability system - calculate sizes and positions
        const baseAbilitySize = Math.min(window.innerWidth / 20, 80); // Base size for abilities
        const abilitySpacing = baseAbilitySize * 0.25; // Increased spacing between abilities
        const abilityMargin = Math.min(window.innerWidth * 0.025, 35); // Increased margin inside 
        // background

        // Dynamic ability configuration
        const abilityConfig = getAbilityConfig();
        const activeAbilities = Object.entries(abilityConfig).filter(([key, config]) => config.available);
        
        // Calculate ability background size to fit active abilities only
        const totalAbilities = activeAbilities.length;
        const backgroundWidth = totalAbilities > 0 ? 
            (baseAbilitySize * totalAbilities) + (abilitySpacing * (totalAbilities - 1)) + (abilityMargin * 4) + 80 : 0;
        const backgroundHeight = totalAbilities > 0 ? 
            baseAbilitySize + (abilityMargin * 2) + 30 : 0; // Extra space for cooldown bars and padding
        
        if (totalAbilities > 0) {
            // Position ability background
            const ability_backgroundX = window.innerWidth - backgroundWidth - abilityMargin + 20;
            const ability_backgroundY = window.innerHeight - backgroundHeight - abilityMargin + 20;

            // display ability background image behind abilities
            if (abilityBackgroundImageRef.current) {
                ctx.drawImage(abilityBackgroundImageRef.current, ability_backgroundX, ability_backgroundY, backgroundWidth, backgroundHeight);
            }

            // Render each active ability dynamically
            activeAbilities.forEach(([keyBinding, config], index) => {
                const abilityX = ability_backgroundX + abilityMargin + (baseAbilitySize + abilitySpacing) * index + 70;
                const abilityY = ability_backgroundY + abilityMargin;
                
                // Get ability data based on the selected ability
                let abilityRef, isOnCooldown, cooldownStartTime, cooldownDuration, abilityName;
                
                switch (config.ability) {
                    case 'reload':
                        abilityRef = abilityReloadRef.current;
                        isOnCooldown = abilityOnCooldown.current;
                        cooldownStartTime = abilityCooldownStartTime.current;
                        cooldownDuration = RELOADTIME_ABILITY_BOOST_COOLDOWN;
                        abilityName = 'R';
                        break;
                    case 'splash':
                        abilityRef = splashAbilityRef.current;
                        isOnCooldown = splashAbilityOnCooldown.current;
                        cooldownStartTime = splashAbilityCooldownStartTime.current;
                        cooldownDuration = SPLASH_COOLDOWN;
                        abilityName = 'R';
                        break;
                    case 'flash':
                        abilityRef = flashAbilityRef.current;
                        isOnCooldown = flashAbilityOnCooldown.current;
                        cooldownStartTime = flashAbilityCooldownStartTime.current;
                        cooldownDuration = FLASH_COOLDOWN;
                        abilityName = 'F';
                        break;
                    case 'speed':
                        abilityRef = speedAbilityRef.current;
                        isOnCooldown = speedAbilityOnCooldown.current;
                        cooldownStartTime = speedAbilityCooldownStartTime.current;
                        cooldownDuration = SPEED_COOLDOWN;
                        abilityName = 'F';
                        break;
                    case 'teleport':
                        abilityRef = teleportAbilityRef.current;
                        isOnCooldown = teleportAbilityOnCooldown.current;
                        cooldownStartTime = teleportAbilityCooldownStartTime.current;
                        cooldownDuration = TELEPORT_COOLDOWN;
                        abilityName = 'T';
                        break;
                    default:
                        return; // Skip unknown abilities
                }
                
                if (!abilityRef) return; // Skip if image not loaded
                
                // Draw ability icon with opacity based on cooldown
                ctx.save();
                if (isOnCooldown) {
                    ctx.globalAlpha = 0.5; // Dim the icon when on cooldown
                }
                ctx.drawImage(abilityRef, abilityX, abilityY, baseAbilitySize, baseAbilitySize);
                ctx.restore();
                
                // Draw cooldown progress bar if ability is on cooldown
                if (isOnCooldown) {
                    const elapsed = currentTime - cooldownStartTime;
                    const cooldownProgress = Math.min(elapsed / cooldownDuration, 1);
                    
                    // Horizontal cooldown progress bar (below ability icon)
                    const cooldownBarWidth = baseAbilitySize; // Same width as ability icon
                    const cooldownBarHeight = 15; // Height for horizontal bar
                    const cooldownBarX = abilityX; // Same X as ability icon
                    const cooldownBarY = abilityY + baseAbilitySize + 8; // Below the ability icon
                    
                    ctx.save();
                    
                    // Background (darker for contrast)
                    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
                    drawRoundedRect(ctx, cooldownBarX, cooldownBarY, cooldownBarWidth, cooldownBarHeight, 5);
                    ctx.fill();
                    
                    // Progress (brighter red) - fills from left to right
                    ctx.fillStyle = "rgba(255, 50, 50, 0.9)"; // Brighter red for cooldown
                    const progressWidth = (cooldownBarWidth - 4) * cooldownProgress; // Progress width
                    if (progressWidth > 0) {
                        drawRoundedRect(ctx, cooldownBarX + 2, cooldownBarY + 2, progressWidth, cooldownBarHeight - 4, 3);
                        ctx.fill();
                    }
                    
                    // Add border for better definition
                    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
                    ctx.lineWidth = 1;
                    drawRoundedRect(ctx, cooldownBarX, cooldownBarY, cooldownBarWidth, cooldownBarHeight, 5);
                    ctx.stroke();
                    
                    ctx.restore();
                } else {
                    // Draw key binding letter when not on cooldown
                    ctx.fillStyle = "white";
                    ctx.font = `${Math.min(baseAbilitySize / 2, 23)}px 'Rajdhani', sans-serif`;
                    // Center the letter horizontally and position it below the ability icon
                    const letterX = abilityX + (baseAbilitySize * 0.4); // Center horizontally
                    const letterY = abilityY + baseAbilitySize + (baseAbilitySize * 0.3); // Position below icon
                    ctx.fillText(abilityName, letterX, letterY);
                }
            });
        }

        


        if (!looseRef.current){
            animationFrameId = requestAnimationFrame(gameLoop);

        }
    }


    gameLoop();

    return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
    };

    },[]);
    function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

    

    return (
        <div>
        <canvas ref={canvasRef} />
        {loose && (
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: '40px',
                borderRadius: '15px',
                textAlign: 'center',
                color: 'white',
                zIndex: 10,
                fontFamily: "'MedievalSharp', cursive"
            }}>
                <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>You Lost!</h1>
                <p style={{ fontSize: '24px', marginBottom: '30px' }}>Final Score: {score.current}</p>
                <Link to="/loadout"> Back</Link>
            </div>
        )}
        </div>
    );
}