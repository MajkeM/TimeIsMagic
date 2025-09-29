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
import abilityBackground from "../Sprites/ability-background.png";
import scoreBackground from "../Sprites/score-background.png";


export default function GameCanvas() {

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

    // end abilities

    // constants
    


    const SPAWN_BASIC_ENEMY_TIME = 2000;
    const SPAWN_BASIC_ENEMY_TIME_MIN = 1000;

    const SPAWN_TRIPPLESHOOT_ENEMY_TIME = 10000;
    const SPAWN_TRIPPLESHOOT_ENEMY_TIME_MIN = 5000;

    const TRIPPLESHOOT_ENEMY_BULLET_ANGLE = 0.6 // in radians, 0.2 = 11.46 degrees

    const PLAYER_SPEED = 3;
    const PLAYER_SPEED_SLOW = 1;
    const PLAYER_BULLET_SPEED = 15;
    const PLAYER_BULLET_SPEED_SLOW = 1;
    const PLAYER_COLLISION_RADIUS = 40; // Collision radius for player (180x180 sprite)
    
    const BASIC_ENEMY_SPEED = 1.5;
    const BASIC_ENEMY_BULLET_SPEED = 10;
    const BASIC_ENEMY_SPEED_SLOW = 1;
    const BASIC_ENEMY_BULLET_SPEED_SLOW = 1.5;

    const GOBLIN_BULLET_SIZE = 125; // Size of goblin bullet sprite (width and height) - zmenšeno z 120
    const GOBLIN_BULLET_RADIUS = 20; // Collision radius for goblin bullets - zmenšeno z 25

    const TRIPPLESHOOT_ENEMY_SPEED = 1.5;
    const TRIPPLESHOOT_ENEMY_BULLET_SPEED = 10;
    const TRIPPLESHOOT_ENEMY_SPEED_SLOW = 1;
    const TRIPPLESHOOT_ENEMY_BULLET_SPEED_SLOW = 1.5;





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




    const [loose, setLoose] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (((e.key === "r" || e.key === "R") && RELOAD_ABILITY) && !abilityOnCooldown.current){
                // Aktivovat ability boost
                reloadTimeRef.current = RELOADTIME_ABILITY_BOOST;
                abilityOnCooldown.current = true;
                abilityCooldownStartTime.current = performance.now(); // Start cooldown timer
                
                console.log("Reload boost activated!"); // Debug

                // Vrátit na normální reload time po duration
                setTimeout(() => {
                    reloadTimeRef.current = RELOADTIME;
                    console.log("Reload boost ended"); // Debug
                }, RELOADTIME_ABILITY_BOOST_DURATION);
                
                // Reset cooldown
                setTimeout(() => {
                    abilityOnCooldown.current = false;
                    console.log("Ability ready again"); // Debug
                }, RELOADTIME_ABILITY_BOOST_COOLDOWN);
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    // when player presses T key, enemies will dissapear on in around TELEPORT_DISTANCE distance from cursor. So it kills enemies around cursor
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.key === "t" || e.key === "T") && TELEPORT_ABILITY && !teleportAbilityOnCooldown.current) {
                // Activate teleport ability visual indicator
                teleportAbilityActive.current = true;
                teleportAbilityStartTime.current = performance.now();
                teleportAbilityOnCooldown.current = true;
                teleportAbilityCooldownStartTime.current = performance.now();
                
                // Remove enemies within TELEPORT_DISTANCE from mouse cursor
                basicEnemyRef.current = basicEnemyRef.current.filter(enemy => {
                    const ex = enemy.x + enemy.width / 2;
                    const ey = enemy.y + enemy.height / 4; // Hlava - čtvrtina z vrchu
                    const distance = Math.sqrt((ex - mousemove.current.x) ** 2 + (ey - mousemove.current.y) ** 2);
                    return distance > TELEPORT_DISTANCE;
                });
                trippleShootEnemyRef.current = trippleShootEnemyRef.current.filter(enemy => {
                    const ex = enemy.x + enemy.width / 2;
                    const ey = enemy.y + enemy.height / 4; // Hlava - čtvrtina z vrchu
                    const distance = Math.sqrt((ex - mousemove.current.x) ** 2 + (ey - mousemove.current.y) ** 2);
                    return distance > TELEPORT_DISTANCE;
                });

                console.log("Teleport ability activated!"); // Debug

                setTimeout(() => {
                    teleportAbilityActive.current = false;
                    console.log("Teleport ability ended"); // Debug
                }, TELEPORT_DURATION);

                setTimeout(() => {
                    teleportAbilityOnCooldown.current = false;
                    console.log("Teleport ability ready again"); // Debug
                }, TELEPORT_COOLDOWN);
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    })


    // when player presses F key, teleport in the direction of mouse cursor
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.key === "f" || e.key === "F") && FLASH_ABILITY && !flashAbilityOnCooldown.current) {
                // Calculate from player center to mouse cursor
                const playerCenterX = playerRef.current.x + playerRef.current.width / 2;
                const playerCenterY = playerRef.current.y + playerRef.current.height / 2;
                
                const dx = mousemove.current.x - playerCenterX;
                const dy = mousemove.current.y - playerCenterY;
                const length = Math.sqrt(dx * dx + dy * dy);
                const dirX = dx / length;
                const dirY = dy / length;
                
                // Calculate new position
                const newX = playerRef.current.x + dirX * flash_distance;
                const newY = playerRef.current.y + dirY * flash_distance;
                
                // Boundary checking to keep player on screen
                playerRef.current.x = Math.max(0, Math.min(newX, window.innerWidth - playerRef.current.width));
                playerRef.current.y = Math.max(0, Math.min(newY, window.innerHeight - playerRef.current.height));
                
                // Start cooldown
                flashAbilityOnCooldown.current = true;
                flashAbilityCooldownStartTime.current = performance.now();
                
                console.log("Flash ability activated!"); // Debug
                
                // Reset cooldown
                setTimeout(() => {
                    flashAbilityOnCooldown.current = false;
                    console.log("Flash ability ready again"); // Debug
                }, FLASH_COOLDOWN);
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    
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

        // Helper function for circular collision detection with head positioning
        const circularCollision = (obj1, obj2, obj1Radius = null, obj2Radius = null, obj1IsEnemy = false) => {
            let obj1CenterX, obj1CenterY;
            
            if (obj1IsEnemy) {
                // Pro nepřítele - umístit collision na hlavu
                obj1CenterX = obj1.x + obj1.width / 2;
                obj1CenterY = obj1.y + obj1.height / 4; // Hlava v horní čtvrtinw
            } else {
                // Pro hráče a bullets - normální střed
                obj1CenterX = obj1.x + obj1.width / 2;
                obj1CenterY = obj1.y + obj1.height / 2;
            }
            
            const obj2CenterX = obj2.x + (obj2.width || 20) / 2;
            const obj2CenterY = obj2.y + (obj2.height || 20) / 2;
            
            const radius1 = obj1Radius || 20;
            const radius2 = obj2Radius || Math.min(obj2.width || 20, obj2.height || 20) / 2;
            
            const distance = Math.sqrt(
                Math.pow(obj1CenterX - obj2CenterX, 2) + 
                Math.pow(obj1CenterY - obj2CenterY, 2)
            );
            
            return distance < (radius1 + radius2);
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
        const playerRadius = PLAYER_COLLISION_RADIUS; // Use constant for consistency
        
        ctx.strokeStyle = "rgba(0, 255, 0, 0.5)"; // Semi-transparent green
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(playerCenterX, playerCenterY, playerRadius, 0, 2 * Math.PI);
        ctx.stroke();

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
            const bulletSize = 100; // Stejná velikost jako sprite
            const bulletCenterX = bullet.x + bulletSize/2; // Střed podle velikosti sprite (30/2)
            const bulletCenterY = bullet.y + bulletSize/2; // Střed podle velikosti sprite (30/2)  
            const bulletRadius = 15; // Větší collision radius pro větší sprite
            
            ctx.strokeStyle = "rgba(255, 255, 0, 0.6)"; // Semi-transparent yellow
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(bulletCenterX, bulletCenterY, bulletRadius, 0, 2 * Math.PI);
            ctx.stroke();
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
            const enemyRadius = 25; // Menší radius než obrázek (původně 25)
            ctx.strokeStyle = "rgba(128, 0, 128, 0.4)"; // Semi-transparent purple
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(enemyCenterX, enemyCenterY, enemyRadius, 0, 2 * Math.PI);
            ctx.stroke();
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
            const bulletCenterX = bullet.x; // bullet center at bullet position
            const bulletCenterY = bullet.y;
            const bulletRadius = GOBLIN_BULLET_RADIUS; // Use constant for collision radius
            
            ctx.strokeStyle = "rgba(255, 0, 0, 0.3)"; // Semi-transparent red
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(bulletCenterX, bulletCenterY, bulletRadius, 0, 2 * Math.PI);
            ctx.stroke();
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
            const bulletCenterX = bullet.x;
            const bulletCenterY = bullet.y;
            const bulletRadius = 20; // Collision radius pro triple shoot bullets
            
            ctx.strokeStyle = "rgba(0, 0, 255, 0.3)"; // Semi-transparent blue
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(bulletCenterX, bulletCenterY, bulletRadius, 0, 2 * Math.PI);
            ctx.stroke();
        });
        
        // Remove basic enemy bullets that are out of bounds
        basicEnemyBulletsRef.current = basicEnemyBulletsRef.current.filter((bullet) => {
            return bullet.x >= 0 && bullet.x <= window.innerWidth && bullet.y >= 0 && bullet.y <= window.innerHeight;
        });


        // collision beetwen player and tripple shoot enemy bullets (using circular collision)
        trippleShootEnemyBulletsRef.current.forEach((bullet, index) => {
            const bulletObj = { x: bullet.x, y: bullet.y, width: 20, height: 20 }; // Triple shoot bullet size
            const playerRadius = PLAYER_COLLISION_RADIUS; // Use constant
            const bulletRadius = 10; // Triple shoot bullet radius
            
            if (circularCollision(playerRef.current, bulletObj, playerRadius, bulletRadius)) {
                trippleShootEnemyBulletsRef.current.splice(index, 1);
                setLoose(true);
            }
        });

        // coliision beetwen tripple shoot enemy and player bullets (using circular collision)
        bullets.current.forEach((bullet, bIndex) => {
            trippleShootEnemyRef.current.forEach((enemy, eIndex) => {
                // Create bullet object for circular collision
                const bulletObj = { x: bullet.x, y: bullet.y, width: 30, height: 30 }; // Stejná velikost jako sprite
                const enemyRadius = 15; // Same smaller radius as visual debug
                const bulletRadius = 15; // Větší radius pro větší sprite
                
                if (circularCollision(enemy, bulletObj, enemyRadius, bulletRadius)) {
                    // Remove both bullet and enemy on collision
                    bullets.current.splice(bIndex, 1);
                    trippleShootEnemyRef.current.splice(eIndex, 1);
                    score.current += 30;
                    difficulty.current += Math.floor(score.current / 100);
                }
            })
        });

        // Remove tripple shoot enemy bullets that are out of bounds
        trippleShootEnemyBulletsRef.current = trippleShootEnemyBulletsRef.current.filter((bullet) => {
            return bullet.x >= 0 && bullet.x <= window.innerWidth && bullet.y >= 0 && bullet.y <= window.innerHeight;
        });


        // MAIN GAME function - if player is not moving, enemy and bullets move very slowly
        if (!moving.current){
            basicEnemySpeed.current = BASIC_ENEMY_SPEED_SLOW;
            bulletSpeed.current = PLAYER_BULLET_SPEED_SLOW;
            enemyBulletSpeed.current = BASIC_ENEMY_BULLET_SPEED_SLOW;
            trippleShootEnemyBulletSpeed.current = TRIPPLESHOOT_ENEMY_BULLET_SPEED_SLOW;
            trippleShootEnemySpeed.current = TRIPPLESHOOT_ENEMY_SPEED_SLOW;

        }
        else {
            basicEnemySpeed.current = BASIC_ENEMY_SPEED;
            bulletSpeed.current = PLAYER_BULLET_SPEED;
            enemyBulletSpeed.current = BASIC_ENEMY_BULLET_SPEED;
            trippleShootEnemyBulletSpeed.current = TRIPPLESHOOT_ENEMY_BULLET_SPEED;
            trippleShootEnemySpeed.current = TRIPPLESHOOT_ENEMY_SPEED;

        }

        // "The worst think in games, I dont want to do that" . COLLISIONS

        // Collisions between player and basic enemies (goblin collision)
        basicEnemyRef.current.forEach((enemy, index) => {
            const enemyRadius = 50; // Stejný radius jako vizualizace (hlava goblina)
            const playerRadius = PLAYER_COLLISION_RADIUS; // Use constant
            
            if (circularCollision(enemy, playerRef.current, enemyRadius, playerRadius, true)) { // true = enemy (hlava positioning) - enemy je obj1
                setLoose(true);
            }
        });

        // Collisions between player and triple shoot enemies
        trippleShootEnemyRef.current.forEach((enemy, index) => {
            const enemyRadius = 15; // Stejný radius jako vizualizace
            const playerRadius = PLAYER_COLLISION_RADIUS; // Use constant
            
            if (circularCollision(playerRef.current, enemy, playerRadius, enemyRadius)) {
                setLoose(true);
            }
        });

        // Collisions between player and basic enemy bullets (using circular collision)
        basicEnemyBulletsRef.current.forEach((bullet, index) => {
            // Since bullet.x, bullet.y is the CENTER of the goblin bullet sprite,
            // we need to create bulletObj with top-left corner for consistent collision detection
            const bulletObj = { 
                x: bullet.x - GOBLIN_BULLET_SIZE/2, 
                y: bullet.y - GOBLIN_BULLET_SIZE/2, 
                width: GOBLIN_BULLET_SIZE, 
                height: GOBLIN_BULLET_SIZE 
            };
            const playerRadius = PLAYER_COLLISION_RADIUS; // Use constant
            const bulletRadius = GOBLIN_BULLET_RADIUS; // Use constant for collision radius
            
            if (circularCollision(playerRef.current, bulletObj, playerRadius, bulletRadius)) {
                basicEnemyBulletsRef.current.splice(index, 1);
                setLoose(true);
            }
        })



                // Collisions between player bullets and basic enemies (head collision)
        bullets.current.forEach((bullet, bIndex) => {
            basicEnemyRef.current.forEach((enemy, eIndex) => {
                const bulletObj = { x: bullet.x, y: bullet.y, width: 30, height: 30 }; // Stejná velikost jako sprite
                const enemyRadius = 40; // Stejný radius jako vizualizace
                const bulletRadius = 15; // Větší radius pro větší sprite
                
                if (circularCollision(enemy, bulletObj, enemyRadius, bulletRadius, true)) { // true = enemy
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
                // Fix goblin bullet positioning - bullet.x/y is center, need top-left for collision
                const eBulletObj = { 
                    x: eBullet.x - GOBLIN_BULLET_SIZE/2, 
                    y: eBullet.y - GOBLIN_BULLET_SIZE/2, 
                    width: GOBLIN_BULLET_SIZE, 
                    height: GOBLIN_BULLET_SIZE 
                };
                const bulletObj = { x: bullet.x, y: bullet.y, width: 30, height: 30 }; // Player bullet size
                const eBulletRadius = GOBLIN_BULLET_RADIUS; // Use constant for goblin bullet radius
                const bulletRadius = 15; // Player bullet radius
                
                if (circularCollision(eBulletObj, bulletObj, eBulletRadius, bulletRadius)) {
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
    

        // Calculate ability background size to fit all abilities
        const totalAbilities = 3; // reload, flash, teleport
        const backgroundWidth = (baseAbilitySize * totalAbilities) + (abilitySpacing * (totalAbilities - 1)) + (abilityMargin * 4) + 80;
        const backgroundHeight = baseAbilitySize + (abilityMargin * 2) + 30; // Extra space for cooldown bars and padding
        
        // Position ability background
        const ability_backgroundX = window.innerWidth - backgroundWidth - abilityMargin + 20;
        const ability_backgroundY = window.innerHeight - backgroundHeight - abilityMargin + 20;

        // display ability background image behind abilities
        if (abilityBackgroundImageRef.current) {
            ctx.drawImage(abilityBackgroundImageRef.current, ability_backgroundX, ability_backgroundY, backgroundWidth, backgroundHeight);
        }

        // show at bottom right reload ability image and progress bar if ability is reloading
        if (abilityReloadRef.current && RELOAD_ABILITY) {
            const abilityX = ability_backgroundX + abilityMargin + 70;
            const abilityY = ability_backgroundY + abilityMargin;
            
            // Draw ability icon with opacity based on cooldown
            ctx.save();
            if (abilityOnCooldown.current) {
                ctx.globalAlpha = 0.5; // Dim the icon when on cooldown
            }
            ctx.drawImage(abilityReloadRef.current, abilityX, abilityY, baseAbilitySize, baseAbilitySize);
            ctx.restore();
            
            // Draw cooldown progress bar if ability is on cooldown
            if (abilityOnCooldown.current) {
                const elapsed = currentTime - abilityCooldownStartTime.current;
                const cooldownProgress = Math.min(elapsed / RELOADTIME_ABILITY_BOOST_COOLDOWN, 1);
                
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
            }
            else {
                ctx.fillStyle = "white";
                ctx.font = `${Math.min(baseAbilitySize / 2, 23)}px 'Rajdhani', sans-serif`;
                // Center the letter horizontally and position it below the ability icon
                const letterX = abilityX + (baseAbilitySize * 0.4); // Center horizontally
                const letterY = abilityY + baseAbilitySize + (baseAbilitySize * 0.3); // Position below icon
                ctx.fillText("R", letterX, letterY);
            }
        }
        


        // show at bottom right flash image and cooldown progress bar if ability is reloading

        if (flashAbilityRef.current && FLASH_ABILITY) {
            const abilityX = ability_backgroundX + abilityMargin + (baseAbilitySize + abilitySpacing) + 70;
            const abilityY = ability_backgroundY + abilityMargin;
            
            // Draw ability icon with opacity based on cooldown
            ctx.save();
            if (flashAbilityOnCooldown.current) {
                ctx.globalAlpha = 0.5; // Dim the icon when on cooldown
            }
            ctx.drawImage(flashAbilityRef.current, abilityX, abilityY, baseAbilitySize, baseAbilitySize);
            ctx.restore();
            
            // Draw cooldown progress bar if ability is on cooldown
            if (flashAbilityOnCooldown.current) {
                const elapsed = currentTime - flashAbilityCooldownStartTime.current;
                const cooldownProgress = Math.min(elapsed / FLASH_COOLDOWN, 1);
                
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
            }
            else {
                ctx.fillStyle = "white";
                ctx.font = `${Math.min(baseAbilitySize / 2, 23)}px 'Rajdhani', sans-serif`;
                // Center the letter horizontally and position it below the ability icon
                const letterX = abilityX + (baseAbilitySize * 0.4); // Center horizontally
                const letterY = abilityY + baseAbilitySize + (baseAbilitySize * 0.3); // Position below icon
                ctx.fillText("F", letterX, letterY);
            }
        }


        // show at bottom right teleport image and cooldown progress bar if ability is reloading
        if (teleportAbilityRef.current && TELEPORT_ABILITY) {
            // Draw teleport ability icon
            const abilityX = ability_backgroundX + abilityMargin + (baseAbilitySize + abilitySpacing) * 2 + 70;
            const abilityY = ability_backgroundY + abilityMargin;
            
            ctx.drawImage(
                teleportAbilityRef.current, 
                abilityX, 
                abilityY, 
                baseAbilitySize, 
                baseAbilitySize
            );
            
            // Draw cooldown progress bar if ability is on cooldown
            if (teleportAbilityOnCooldown.current) {
                const elapsed = currentTime - teleportAbilityCooldownStartTime.current;
                const cooldownProgress = Math.min(elapsed / TELEPORT_COOLDOWN, 1);
                
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
            }
            else {
                ctx.fillStyle = "white";
                ctx.font = `${Math.min(baseAbilitySize / 2, 23)}px 'Rajdhani', sans-serif`;
                // Center the letter horizontally and position it below the ability icon
                const letterX = abilityX + (baseAbilitySize * 0.4); // Center horizontally
                const letterY = abilityY + baseAbilitySize + (baseAbilitySize * 0.3); // Position below icon
                ctx.fillText("T", letterX, letterY);
            }
        }

        


        if (!loose){
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

    useEffect(() => {
        if (loose){
            window.location.reload();
        }
    }, [loose]);

    return (
        <div>
        <canvas ref={canvasRef} />
        </div>
    );
}