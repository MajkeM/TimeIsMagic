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
import immortalityAbility from "../Sprites/immortality-ability.png";
import gravitywellAbility from "../Sprites/gravityWellAbility.png";
import phaseAbility from "../Sprites/phaseAbility.png";
import scoreAbility from "../Sprites/scoreAbility.png";
import abilityBackground from "../Sprites/ability-background.png";
import scoreBackground from "../Sprites/score-background.png";
// New enemy sprites
import bomberSprite from "../Sprites/bomberSprite.png"; // Using rock sprite for bomber
import teleporterSprite from "../Sprites/goblinSprite.png"; // Using goblin sprite but different color
import rapunzelSprite from "../Sprites/rapunzelPlayerSprite.png";
// New character sprites (you can change these import paths to your actual sprite files)
import archerSprite from "../Sprites/archerPlayer.png"; // Change this to your archer sprite
import mageSprite from "../Sprites/runeMagePlayer.png"; // Change this to your mage sprite
import { Link } from "react-router-dom";


export default function GameCanvas({showCollision, R_ability, F_ability, T_ability, character}) {

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

        // Gravity Well ability
        const GRAVITY_COOLDOWN = 14000;
        const GRAVITY_DURATION = 3000;
        const GRAVITY_PULL_RADIUS = 250;
        const GRAVITY_PULL_STRENGTH = 8;
        const GRAVITY_EXPLOSION_RADIUS = 150;
        const gravityWellAbilityRef = useRef(null);
        const gravityWellAbilityOnCooldown = useRef(false);
        const gravityWellAbilityCooldownStartTime = useRef(0);
        const gravityWellActive = useRef(false);
        const gravityWellStartTime = useRef(0);
        const gravityWellPosition = useRef({x: 0, y: 0});
        const gravityWellExplosion = useRef(false);
        const gravityWellExplosionStartTime = useRef(0);

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

        // Phase Walk ability
        const PHASEWALK_COOLDOWN = 10000;
        const PHASEWALK_DURATION = 2500;
        const PHASEWALK_SPEED_MULTIPLIER = 2.5;
        const phaseWalkAbilityRef = useRef(null);
        const phaseWalkAbilityOnCooldown = useRef(false);
        const phaseWalkAbilityCooldownStartTime = useRef(0);
        const phaseWalkActive = useRef(false);
        const phaseWalkStartTime = useRef(0);

        // Immortality ability
        const IMMORTALITY_COOLDOWN = 20000;
        const IMMORTALITY_DURATION = 6000;
        const immortalityAbilityRef = useRef(null);
        const immortalityAbilityOnCooldown = useRef(false);
        const immortalityAbilityCooldownStartTime = useRef(0);
        const immortalityAbilityActive = useRef(false);
        const immortalityAbilityStartTime = useRef(0);

        // Score Boost ability
        const SCOREBOOST_COOLDOWN = 12000;
        const SCOREBOOST_POINTS = 100;
        const scoreBoostAbilityRef = useRef(null);
        const scoreBoostAbilityOnCooldown = useRef(false);
        const scoreBoostAbilityCooldownStartTime = useRef(0);
        const scoreBoostEffectActive = useRef(false);
        const scoreBoostEffectStartTime = useRef(0);

    // Ability configuration helper
    const getAbilityConfig = () => {
        return {
            R: {
                ability: R_ability,
                key: 'r',
                available: R_ability === 'reload' || R_ability === 'splash' || R_ability === 'gravitywell'
            },
            F: {
                ability: F_ability,
                key: 'f', 
                available: F_ability === 'flash' || F_ability === 'speed' || F_ability === 'phasewalk'
            },
            T: {
                ability: T_ability,
                key: 't',
                available: T_ability === 'teleport' || T_ability === 'immortality' || T_ability === 'scoreboost'
            }
        };
    };

    // Character configuration helper
    const getCharacterConfig = () => {
        return {
            wizard: {
                sprite: playerSprite,
                combatType: 'bullets',
                width: 180,
                height: 180,
                rotationOffset: -Math.PI/2
            },
            rapunzel: {
                sprite: rapunzelSprite,
                combatType: 'slash',
                width: 180,
                height: 180,
                rotationOffset: Math.PI/2
            },
            archer: {
                sprite: archerSprite,
                combatType: 'arrows',
                width: 180,
                height: 180,
                rotationOffset: -Math.PI/2
            },
            mage: {
                sprite: mageSprite,
                combatType: 'spells',
                width: 180,
                height: 180,
                rotationOffset: -Math.PI/2
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

    // Bomber enemy constants
    const SPAWN_BOMBER_ENEMY_TIME = 15000; // Spawns every 15 seconds
    const SPAWN_BOMBER_ENEMY_TIME_MIN = 8000;
    const BOMBER_ENEMY_SPEED = 2; // Slower than other enemies
    const BOMBER_ENEMY_SPEED_SLOW = 0.5;
    const BOMBER_EXPLOSION_RADIUS = 200; // Large explosion radius
    const BOMBER_FUSE_TIME = 3000; // 3 seconds before explosion
    const BOMBER_WARNING_TIME = 1000; // 1 second warning flash

    // Teleporter enemy constants
    const SPAWN_TELEPORTER_ENEMY_TIME = 12000; // Spawns every 12 seconds
    const SPAWN_TELEPORTER_ENEMY_TIME_MIN = 6000;
    const TELEPORTER_ENEMY_SPEED = 5; // Faster than basic enemies
    const TELEPORTER_ENEMY_SPEED_SLOW = 2;
    const TELEPORTER_BULLET_SPEED = 25; // Homing bullets
    const TELEPORTER_BULLET_SPEED_SLOW = 2;
    const TELEPORTER_TELEPORT_INTERVAL = 4000; // Teleports every 4 seconds
    const TELEPORTER_HOMING_STRENGTH = 0.1; // How strongly bullets home

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

    // Responsive speed system - DISABLED for consistent gameplay across all resolutions
    // Base reference: 1920x1080 (common desktop resolution)
    const BASE_WIDTH = 1920;
    const BASE_HEIGHT = 1080;
    
    // Calculate responsive speed multiplier based on screen size
    const getResponsiveSpeedMultiplier = () => {
        // FIXED: Always return 1.0 for consistent speed across all screen sizes
        // This ensures players on notebooks have the same speed as players on large monitors
        return 1.0;
        
        /* OLD RESPONSIVE CODE - COMMENTED OUT FOR CONSISTENT GAMEPLAY
        const currentWidth = window.innerWidth;
        const currentHeight = window.innerHeight;
        
        // Calculate diagonal ratio for more accurate scaling
        const baseDiagonal = Math.sqrt(BASE_WIDTH * BASE_WIDTH + BASE_HEIGHT * BASE_HEIGHT);
        const currentDiagonal = Math.sqrt(currentWidth * currentWidth + currentHeight * currentHeight);
        const diagonalRatio = currentDiagonal / baseDiagonal;
        
        // Apply some smoothing to prevent extreme speed changes
        // Clamp between 0.5x and 2x speed for reasonable gameplay
        return Math.max(0.5, Math.min(2.0, diagonalRatio));
        */
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

    // bomber enemy
    const bomberEnemyRef = useRef([]);
    const bomberEnemySpeed = useRef(BOMBER_ENEMY_SPEED);
    const lastBomberEnemySpawnTime = useRef(0);
    const bomberImageRef = useRef(null);

    // teleporter enemy
    const teleporterEnemyRef = useRef([]);
    const teleporterEnemyBulletsRef = useRef([]);
    const teleporterEnemySpeed = useRef(TELEPORTER_ENEMY_SPEED);
    const teleporterEnemyBulletSpeed = useRef(TELEPORTER_BULLET_SPEED);
    const lastTeleporterEnemySpawnTime = useRef(0);
    const teleporterImageRef = useRef(null);

    // Slash combat system constants and refs
    const SLASH_RANGE = 200; // Range of slash attack
    const SLASH_DURATION = 300; // Duration of slash animation in ms
    const SLASH_COOLDOWN = 600; // Cooldown between slashes
    const SLASH_ANGLE_SPREAD = Math.PI / 3; // 60 degree slash arc
    
    // Archer combat system constants
    const ARROW_SPEED = 35; // Faster than bullets
    const ARROW_COOLDOWN = 400; // Faster than bullets but slower than slash
    const ARROW_PIERCING = 3; // Can pierce through 3 enemies
    
    // Mage combat system constants
    const SPELL_COOLDOWN = 1700; // Slower cast time
    const SPELL_DAMAGE_RADIUS = 120; // AOE damage radius
    const SPELL_DURATION = 800; // How long spell effect lasts
    
    // Slash system refs
    const slashActive = useRef(false);
    const slashStartTime = useRef(0);
    const canSlash = useRef(true);
    const lastSlashTime = useRef(0);
    const slashDirection = useRef(0); // Angle of slash
    const rapunzelImageRef = useRef(null);

    // Archer system refs
    const arrows = useRef([]);
    const canShootArrow = useRef(true);
    const lastArrowTime = useRef(0);
    const archerImageRef = useRef(null);
    
    // Mage system refs
    const spells = useRef([]);
    const canCastSpell = useRef(true);
    const lastSpellTime = useRef(0);
    const mageImageRef = useRef(null);

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
                } else if (R_ability === 'gravitywell' && !gravityWellAbilityOnCooldown.current) {
                    // Gravity Well ability - creates a black hole at mouse position
                    gravityWellActive.current = true;
                    gravityWellStartTime.current = currentTime;
                    gravityWellPosition.current = {x: mousemove.current.x, y: mousemove.current.y};
                    gravityWellAbilityOnCooldown.current = true;
                    gravityWellAbilityCooldownStartTime.current = currentTime;
                    
                    // Remove gravity well after duration and create explosion
                    setTimeout(() => {
                        if (gravityWellActive.current) {
                            // Start explosion effect
                            gravityWellExplosion.current = true;
                            gravityWellExplosionStartTime.current = performance.now();
                            
                            // Remove explosion effect after short duration
                            setTimeout(() => {
                                gravityWellExplosion.current = false;
                            }, 500); // 0.5 second explosion effect
                            
                            // Explosion damages enemies in radius
                            const gravityX = gravityWellPosition.current.x;
                            const gravityY = gravityWellPosition.current.y;
                            
                            // Damage basic enemies
                            basicEnemyRef.current = basicEnemyRef.current.filter(enemy => {
                                const enemyCenterX = enemy.x + enemy.width / 2;
                                const enemyCenterY = enemy.y + enemy.height / 2;
                                const distance = Math.sqrt((enemyCenterX - gravityX) ** 2 + (enemyCenterY - gravityY) ** 2);
                                if (distance <= GRAVITY_EXPLOSION_RADIUS) {
                                    score.current += 10;
                                    return false;
                                }
                                return true;
                            });
                            
                            // Damage triple shoot enemies
                            trippleShootEnemyRef.current = trippleShootEnemyRef.current.filter(enemy => {
                                const enemyCenterX = enemy.x + enemy.width / 2;
                                const enemyCenterY = enemy.y + enemy.height / 2;
                                const distance = Math.sqrt((enemyCenterX - gravityX) ** 2 + (enemyCenterY - gravityY) ** 2);
                                if (distance <= GRAVITY_EXPLOSION_RADIUS) {
                                    score.current += 30;
                                    return false;
                                }
                                return true;
                            });
                            
                            // Damage bomber enemies
                            bomberEnemyRef.current = bomberEnemyRef.current.filter(enemy => {
                                const enemyCenterX = enemy.x + enemy.width / 2;
                                const enemyCenterY = enemy.y + enemy.height / 2;
                                const distance = Math.sqrt((enemyCenterX - gravityX) ** 2 + (enemyCenterY - gravityY) ** 2);
                                if (distance <= GRAVITY_EXPLOSION_RADIUS) {
                                    score.current += 25;
                                    return false;
                                }
                                return true;
                            });
                            
                            // Damage teleporter enemies
                            teleporterEnemyRef.current = teleporterEnemyRef.current.filter(enemy => {
                                const enemyCenterX = enemy.x + enemy.width / 2;
                                const enemyCenterY = enemy.y + enemy.height / 2;
                                const distance = Math.sqrt((enemyCenterX - gravityX) ** 2 + (enemyCenterY - gravityY) ** 2);
                                if (distance <= GRAVITY_EXPLOSION_RADIUS) {
                                    score.current += 35;
                                    return false;
                                }
                                return true;
                            });
                            
                            gravityWellActive.current = false;
                        }
                    }, GRAVITY_DURATION);
                    
                    // Reset cooldown
                    setTimeout(() => {
                        gravityWellAbilityOnCooldown.current = false;
                    }, GRAVITY_COOLDOWN);
                }
            }

            // T Ability handler (teleport or immortality)
            if (key === "t" && abilityConfig.T.available) {
                if (T_ability === 'teleport' && !teleportAbilityOnCooldown.current) {
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
                } else if (T_ability === 'immortality' && !immortalityAbilityOnCooldown.current) {
                    // Immortality ability - player becomes invulnerable for 6 seconds
                    immortalityAbilityActive.current = true;
                    immortalityAbilityStartTime.current = currentTime;
                    immortalityAbilityOnCooldown.current = true;
                    immortalityAbilityCooldownStartTime.current = currentTime;
                    
                    // Reset immortality after duration
                    setTimeout(() => {
                        immortalityAbilityActive.current = false;
                    }, IMMORTALITY_DURATION);
                    
                    // Reset cooldown
                    setTimeout(() => {
                        immortalityAbilityOnCooldown.current = false;
                    }, IMMORTALITY_COOLDOWN);
                } else if (T_ability === 'scoreboost' && !scoreBoostAbilityOnCooldown.current) {
                    // Score Boost ability - instantly adds 100 points
                    score.current += SCOREBOOST_POINTS;
                    scoreBoostEffectActive.current = true;
                    scoreBoostEffectStartTime.current = currentTime;
                    scoreBoostAbilityOnCooldown.current = true;
                    scoreBoostAbilityCooldownStartTime.current = currentTime;
                    
                    // Remove visual effect after short duration
                    setTimeout(() => {
                        scoreBoostEffectActive.current = false;
                    }, 1000);
                    
                    // Reset cooldown
                    setTimeout(() => {
                        scoreBoostAbilityOnCooldown.current = false;
                    }, SCOREBOOST_COOLDOWN);
                }
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
                } else if (F_ability === 'phasewalk' && !phaseWalkAbilityOnCooldown.current) {
                    // Phase Walk ability - player becomes ghost-like and can pass through everything
                    phaseWalkActive.current = true;
                    phaseWalkStartTime.current = currentTime;
                    phaseWalkAbilityOnCooldown.current = true;
                    phaseWalkAbilityCooldownStartTime.current = currentTime;
                    
                    // Reset phase walk after duration
                    setTimeout(() => {
                        phaseWalkActive.current = false;
                    }, PHASEWALK_DURATION);
                    
                    // Reset cooldown
                    setTimeout(() => {
                        phaseWalkAbilityOnCooldown.current = false;
                    }, PHASEWALK_COOLDOWN);
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

    // teleporter enemy bullets (shoots homing bullets every 2.5 seconds)
    useEffect(() => {
        const shootTeleporterEnemyBullets = () => {
            teleporterEnemyRef.current.forEach((enemy) => {
                const dx = (playerRef.current.x + playerRef.current.width / 2) - (enemy.x + enemy.width / 2);
                const dy = (playerRef.current.y + playerRef.current.height / 2) - (enemy.y + enemy.height / 2);
                const length = Math.sqrt(dx * dx + dy * dy);
                const dirX = dx / length;
                const dirY = dy / length;

                teleporterEnemyBulletsRef.current.push({
                    x: enemy.x + enemy.width / 2,
                    y: enemy.y + enemy.height / 2,
                    dirX: dirX,
                    dirY: dirY,
                    homing: true, // Mark as homing bullet
                    spawnTime: performance.now(),
                });
            });
        };

        const intervalId = setInterval(shootTeleporterEnemyBullets, 2500);
        return () => clearInterval(intervalId);
    }, []);

    // teleporter enemy teleportation effect
    useEffect(() => {
        const teleportEnemies = () => {
            teleporterEnemyRef.current.forEach((enemy) => {
                // Teleport to random position on screen edge
                const side = Math.floor(Math.random() * 4);
                let newX, newY;
                
                switch (side) {
                    case 0: // top
                        newX = Math.random() * (window.innerWidth - enemy.width);
                        newY = 0;
                        break;
                    case 1: // right
                        newX = window.innerWidth - enemy.width;
                        newY = Math.random() * (window.innerHeight - enemy.height);
                        break;
                    case 2: // bottom
                        newX = Math.random() * (window.innerWidth - enemy.width);
                        newY = window.innerHeight - enemy.height;
                        break;
                    case 3: // left
                        newX = 0;
                        newY = Math.random() * (window.innerHeight - enemy.height);
                        break;
                }
                
                // Add teleport visual effect
                enemy.teleporting = true;
                enemy.teleportStartTime = performance.now();
                
                // Move to new position after short delay
                setTimeout(() => {
                    enemy.x = newX;
                    enemy.y = newY;
                    enemy.teleporting = false;
                }, 200);
            });
        };

        const intervalId = setInterval(teleportEnemies, TELEPORTER_TELEPORT_INTERVAL);
        return () => clearInterval(intervalId);
    }, []);
    


    // mouse click 
    useEffect(() => {

        

            const handleMouseDown = (e) => {
            const characterConfig = getCharacterConfig();
            const currentCharacter = characterConfig[character] || characterConfig.wizard;
            
            if (currentCharacter.combatType === 'bullets' && canShoot.current) {
                // Wizard bullet combat
                const playerCenterX = playerRef.current.x + playerRef.current.width / 2;
                const playerCenterY = playerRef.current.y + playerRef.current.height / 2;
                
                const dx = mousemove.current.x - playerCenterX;
                const dy = mousemove.current.y - playerCenterY;
                const length = Math.sqrt(dx * dx + dy * dy);
                const dirX = dx / length;
                const dirY = dy / length;
                const bulletAngle = Math.atan2(dy, dx);
                lastShotTime.current = performance.now();

                bullets.current.push({
                    x: playerCenterX - 15,
                    y: playerCenterY - 15,
                    dirX: dirX,
                    dirY: dirY,
                    angle: bulletAngle,
                })
                canShoot.current = false;
                setTimeout(() => {
                    canShoot.current = true;
                }, reloadTimeRef.current);
            } else if (currentCharacter.combatType === 'slash' && canSlash.current) {
                // Rapunzel slash combat
                const playerCenterX = playerRef.current.x + playerRef.current.width / 2;
                const playerCenterY = playerRef.current.y + playerRef.current.height / 2;
                
                const dx = mousemove.current.x - playerCenterX;
                const dy = mousemove.current.y - playerCenterY;
                const slashAngle = Math.atan2(dy, dx);
                
                slashActive.current = true;
                slashStartTime.current = performance.now();
                slashDirection.current = slashAngle;
                lastSlashTime.current = performance.now();
                
                canSlash.current = false;
                setTimeout(() => {
                    slashActive.current = false;
                }, SLASH_DURATION);
                
                setTimeout(() => {
                    canSlash.current = true;
                }, SLASH_COOLDOWN);
            } else if (currentCharacter.combatType === 'arrows' && canShootArrow.current) {
                // Archer arrow combat
                const playerCenterX = playerRef.current.x + playerRef.current.width / 2;
                const playerCenterY = playerRef.current.y + playerRef.current.height / 2;
                
                const dx = mousemove.current.x - playerCenterX;
                const dy = mousemove.current.y - playerCenterY;
                const length = Math.sqrt(dx * dx + dy * dy);
                const dirX = dx / length;
                const dirY = dy / length;
                const arrowAngle = Math.atan2(dy, dx);
                lastArrowTime.current = performance.now();

                arrows.current.push({
                    x: playerCenterX - 10,
                    y: playerCenterY - 10,
                    dirX: dirX,
                    dirY: dirY,
                    angle: arrowAngle,
                    pierceCount: 0, // Track how many enemies this arrow has pierced
                    maxPierce: ARROW_PIERCING
                });
                
                canShootArrow.current = false;
                setTimeout(() => {
                    canShootArrow.current = true;
                }, ARROW_COOLDOWN);
            } else if (currentCharacter.combatType === 'spells' && canCastSpell.current) {
                // Mage spell combat
                const currentTime = performance.now();
                
                spells.current.push({
                    x: mousemove.current.x,
                    y: mousemove.current.y,
                    startTime: currentTime,
                    duration: SPELL_DURATION,
                    radius: SPELL_DAMAGE_RADIUS,
                    active: true
                });
                
                canCastSpell.current = false;
                lastSpellTime.current = currentTime;
                
                setTimeout(() => {
                    canCastSpell.current = true;
                }, SPELL_COOLDOWN);
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

    // load immortality ability image
    useEffect(() => {
        const immortalityAbilityImage = new Image();
        immortalityAbilityImage.src = immortalityAbility; // Use the imported sprite
        immortalityAbilityImage.onload = () => {
            immortalityAbilityRef.current = immortalityAbilityImage;
        };
        immortalityAbilityImage.onerror = () => {
            console.error('Failed to load immortality ability sprite');
        };
    }, []);

    // load gravity well ability image
    useEffect(() => {
        const gravitywellAbilityImage = new Image();
        gravitywellAbilityImage.src = gravitywellAbility; // Use the imported sprite
        gravitywellAbilityImage.onload = () => {
            gravityWellAbilityRef.current = gravitywellAbilityImage;
        };
        gravitywellAbilityImage.onerror = () => {
            console.error('Failed to load gravity well ability sprite');
        };
    }, []);

    // load phase walk ability image
    useEffect(() => {
        const phaseAbilityImage = new Image();
        phaseAbilityImage.src = phaseAbility; // Use the imported sprite
        phaseAbilityImage.onload = () => {
            phaseWalkAbilityRef.current = phaseAbilityImage;
        };
        phaseAbilityImage.onerror = () => {
            console.error('Failed to load phase walk ability sprite');
        };
    }, []);

    // load score boost ability image
    useEffect(() => {
        const scoreAbilityImage = new Image();
        scoreAbilityImage.src = scoreAbility; // Use the imported sprite
        scoreAbilityImage.onload = () => {
            scoreBoostAbilityRef.current = scoreAbilityImage;
        };
        scoreAbilityImage.onerror = () => {
            console.error('Failed to load score boost ability sprite');
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

    // Load bomber enemy sprite
    useEffect(() => {
        const bomberImage = new Image();
        bomberImage.src = bomberSprite; // Use the imported sprite
        bomberImage.onload = () => {
            bomberImageRef.current = bomberImage;
        };
        bomberImage.onerror = () => {
            console.error('Failed to load bomber enemy sprite');
        };
    }, []);

    // Load teleporter enemy sprite
    useEffect(() => {
        const teleporterImage = new Image();
        teleporterImage.src = teleporterSprite; // Use the imported sprite
        teleporterImage.onload = () => {
            teleporterImageRef.current = teleporterImage;
        };
        teleporterImage.onerror = () => {
            console.error('Failed to load teleporter enemy sprite');
        };
    }, []);

    // Load Rapunzel sprite
    useEffect(() => {
        const rapunzelImage = new Image();
        rapunzelImage.src = rapunzelSprite; // Use the imported sprite
        rapunzelImage.onload = () => {
            rapunzelImageRef.current = rapunzelImage;
        };
        rapunzelImage.onerror = () => {
            console.error('Failed to load Rapunzel sprite');
        };
    }, []);

    // Load Archer sprite
    useEffect(() => {
        const archerImage = new Image();
        archerImage.src = archerSprite; // Use the imported sprite
        archerImage.onload = () => {
            archerImageRef.current = archerImage;
        };
        archerImage.onerror = () => {
            console.error('Failed to load Archer sprite');
        };
    }, []);

    // Load Mage sprite
    useEffect(() => {
        const mageImage = new Image();
        mageImage.src = mageSprite; // Use the imported sprite
        mageImage.onload = () => {
            mageImageRef.current = mageImage;
        };
        mageImage.onerror = () => {
            console.error('Failed to load Mage sprite');
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

        // Character configuration for this frame
        const characterConfig = getCharacterConfig();
        const currentCharacter = characterConfig[character] || characterConfig.wizard;

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
        
        // Use character configuration from top of game loop
        const rotationAngle = baseRotationAngle + currentCharacter.rotationOffset;
        
        // Get correct sprite based on character
        let currentPlayerImage;
        switch(character) {
            case 'rapunzel':
                currentPlayerImage = rapunzelImageRef.current;
                break;
            case 'archer':
                currentPlayerImage = archerImageRef.current;
                break;
            case 'mage':
                currentPlayerImage = mageImageRef.current;
                break;
            default:
                currentPlayerImage = playerImageRef.current;
        }
        
        if (currentPlayerImage) {
            // Save the current context state
            ctx.save();
            
            // Move to player center, rotate, then move back
            ctx.translate(playerCenterX, playerCenterY);
            ctx.rotate(rotationAngle);
            
            // Draw the image centered on the rotation point
            ctx.drawImage(
                currentPlayerImage, 
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

        // Draw combat effects based on character type
        if (currentCharacter.combatType === 'slash' && slashActive.current) {
            const currentTime = performance.now();
            const slashProgress = (currentTime - slashStartTime.current) / SLASH_DURATION;
            
            if (slashProgress <= 1) {
                ctx.save();
                
                // Create slash arc
                const startAngle = slashDirection.current - SLASH_ANGLE_SPREAD / 2;
                const endAngle = slashDirection.current + SLASH_ANGLE_SPREAD / 2;
                
                // Yellow slash effect with gradient
                const slashGradient = ctx.createRadialGradient(
                    playerCenterX, playerCenterY, 0,
                    playerCenterX, playerCenterY, SLASH_RANGE
                );
                slashGradient.addColorStop(0, 'rgba(255, 255, 0, 0.8)');
                slashGradient.addColorStop(0.7, 'rgba(255, 215, 0, 0.6)');
                slashGradient.addColorStop(1, 'rgba(255, 165, 0, 0.2)');
                
                ctx.fillStyle = slashGradient;
                ctx.strokeStyle = 'rgba(255, 255, 0, 0.9)';
                ctx.lineWidth = 4;
                
                // Draw slash arc
                ctx.beginPath();
                ctx.arc(playerCenterX, playerCenterY, SLASH_RANGE, startAngle, endAngle);
                ctx.lineTo(playerCenterX, playerCenterY);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                
                // Add sparkle effects
                for (let i = 0; i < 6; i++) {
                    const sparkleAngle = startAngle + (endAngle - startAngle) * (i / 5);
                    const sparkleDistance = SLASH_RANGE * (0.7 + 0.3 * Math.sin(currentTime / 50 + i));
                    const sparkleX = playerCenterX + Math.cos(sparkleAngle) * sparkleDistance;
                    const sparkleY = playerCenterY + Math.sin(sparkleAngle) * sparkleDistance;
                    
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.beginPath();
                    ctx.arc(sparkleX, sparkleY, 3, 0, 2 * Math.PI);
                    ctx.fill();
                }
                
                ctx.restore();
            }
        }

        // Draw player collision boundary (debug visualization)
        if (showCollision) {
            const playerRadius = PLAYER_COLLISION_RADIUS; // Use constant for consistency
            
            ctx.strokeStyle = "rgba(0, 255, 0, 0.5)"; // Semi-transparent green
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(playerCenterX, playerCenterY, playerRadius, 0, 2 * Math.PI);
            ctx.stroke();
            
            // Draw slash range for Rapunzel (debug)
            if (currentCharacter.combatType === 'slash') {
                ctx.strokeStyle = "rgba(255, 255, 0, 0.3)"; // Semi-transparent yellow
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(playerCenterX, playerCenterY, SLASH_RANGE, 0, 2 * Math.PI);
                ctx.stroke();
            }
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

        // Draw immortality progress bar when immortality ability is active
        if (immortalityAbilityActive.current) {
            const elapsed = currentTime - immortalityAbilityStartTime.current;
            const remainingTime = IMMORTALITY_DURATION - elapsed;
            const progress = remainingTime / IMMORTALITY_DURATION; // Progress from 1 to 0
            
            // Position the progress bar above the player with compact spacing
            const barWidth = 100; // Slightly smaller for better fit
            const barHeight = 6;  // Slightly smaller for compactness
            const barX = playerCenterX - barWidth / 2;
            const barY = playerRef.current.y - 20; // Closer to player
            
            // Add a golden glow effect around the player when immortal
            ctx.save();
            ctx.shadowColor = 'gold';
            ctx.shadowBlur = 20;
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)'; // Gold color
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(playerCenterX, playerCenterY, PLAYER_COLLISION_RADIUS + 10, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.restore();
            
            // Draw progress bar background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);
            
            // Draw progress bar border
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)'; // Gold border
            ctx.lineWidth = 1;
            ctx.strokeRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);
            
            // Draw progress bar fill
            const fillWidth = barWidth * progress;
            const gradient = ctx.createLinearGradient(barX, barY, barX + barWidth, barY);
            gradient.addColorStop(0, 'rgba(255, 215, 0, 0.9)'); // Gold
            gradient.addColorStop(0.5, 'rgba(255, 255, 0, 0.9)'); // Yellow
            gradient.addColorStop(1, 'rgba(255, 165, 0, 0.9)'); // Orange
            
            ctx.fillStyle = gradient;
            ctx.fillRect(barX, barY, fillWidth, barHeight);
            
            // Draw remaining time text (smaller font)
            const timeLeft = Math.ceil(remainingTime / 1000);
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`Immortal: ${timeLeft}s`, playerCenterX, barY - 4);
            ctx.textAlign = 'left'; // Reset text alignment
        }

        // Draw speed ability progress bar when speed ability is active
        if (speedAbilityActive.current) {
            const elapsed = currentTime - speedAbilityStartTime.current;
            const remainingTime = SPEED_DURATION - elapsed;
            const progress = remainingTime / SPEED_DURATION; // Progress from 1 to 0
            
            // Position with compact spacing (12px between bars)
            const barWidth = 100;
            const barHeight = 6;
            const barX = playerCenterX - barWidth / 2;
            const barY = immortalityAbilityActive.current ? 
                playerRef.current.y - 34 : // 12px above immortality bar
                playerRef.current.y - 20;   // Standard position if only speed active
            
            // Add a blue/cyan glow effect around the player when speed is active
            ctx.save();
            ctx.shadowColor = 'cyan';
            ctx.shadowBlur = 15;
            ctx.strokeStyle = 'rgba(0, 191, 255, 0.8)'; // Deep sky blue
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(playerCenterX, playerCenterY, PLAYER_COLLISION_RADIUS + 5, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.restore();
            
            // Draw progress bar background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);
            
            // Draw progress bar border
            ctx.strokeStyle = 'rgba(0, 191, 255, 0.8)'; // Cyan border
            ctx.lineWidth = 1;
            ctx.strokeRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);
            
            // Draw progress bar fill with speed-themed colors
            const fillWidth = barWidth * progress;
            const speedGradient = ctx.createLinearGradient(barX, barY, barX + barWidth, barY);
            speedGradient.addColorStop(0, 'rgba(0, 191, 255, 0.9)'); // Deep sky blue
            speedGradient.addColorStop(0.5, 'rgba(30, 144, 255, 0.9)'); // Dodger blue
            speedGradient.addColorStop(1, 'rgba(0, 0, 255, 0.9)'); // Blue
            
            ctx.fillStyle = speedGradient;
            ctx.fillRect(barX, barY, fillWidth, barHeight);
            
            // Draw remaining time text (smaller font)
            const timeLeft = Math.ceil(remainingTime / 1000);
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`Speed: ${timeLeft}s`, playerCenterX, barY - 4);
            ctx.textAlign = 'left'; // Reset text alignment
        }

        // Draw reload ability progress bar when reload boost is active
        if (reloadTimeRef.current === RELOADTIME_ABILITY_BOOST) {
            // Calculate elapsed time since ability was activated
            const elapsed = currentTime - abilityCooldownStartTime.current;
            const remainingTime = RELOADTIME_ABILITY_BOOST_DURATION - elapsed;
            
            // Only show if boost is still active (remaining time > 0)
            if (remainingTime > 0) {
                const progress = remainingTime / RELOADTIME_ABILITY_BOOST_DURATION; // Progress from 1 to 0
                
                // Calculate position with compact spacing (12px between bars)
                const barWidth = 100;
                const barHeight = 6;
                const barX = playerCenterX - barWidth / 2;
                let barY = playerRef.current.y - 20; // Default position
                
                // Adjust position based on other active abilities (12px spacing)
                if (immortalityAbilityActive.current && speedAbilityActive.current) {
                    barY = playerRef.current.y - 48; // 12px above speed bar
                } else if (immortalityAbilityActive.current || speedAbilityActive.current) {
                    barY = playerRef.current.y - 34; // 12px above single ability
                }
                
                // Add an orange glow effect around the player when reload boost is active
                ctx.save();
                ctx.shadowColor = 'orange';
                ctx.shadowBlur = 12;
                ctx.strokeStyle = 'rgba(255, 140, 0, 0.8)'; // Dark orange
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(playerCenterX, playerCenterY, PLAYER_COLLISION_RADIUS + 3, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.restore();
                
                // Draw progress bar background
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);
                
                // Draw progress bar border
                ctx.strokeStyle = 'rgba(255, 140, 0, 0.8)'; // Orange border
                ctx.lineWidth = 1;
                ctx.strokeRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);
                
                // Draw progress bar fill with reload-themed colors
                const fillWidth = barWidth * progress;
                const reloadGradient = ctx.createLinearGradient(barX, barY, barX + barWidth, barY);
                reloadGradient.addColorStop(0, 'rgba(255, 140, 0, 0.9)'); // Dark orange
                reloadGradient.addColorStop(0.5, 'rgba(255, 165, 0, 0.9)'); // Orange
                reloadGradient.addColorStop(1, 'rgba(255, 69, 0, 0.9)'); // Red orange
                
                ctx.fillStyle = reloadGradient;
                ctx.fillRect(barX, barY, fillWidth, barHeight);
                
                // Draw remaining time text (smaller font)
                const timeLeft = Math.ceil(remainingTime / 1000);
                ctx.fillStyle = 'white';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(`Reload: ${timeLeft}s`, playerCenterX, barY - 4);
                ctx.textAlign = 'left'; // Reset text alignment
            }
        }

        // Draw gravity well visual effect when active
        if (gravityWellActive.current) {
            const elapsed = currentTime - gravityWellStartTime.current;
            const progress = elapsed / GRAVITY_DURATION;
            const gravityX = gravityWellPosition.current.x;
            const gravityY = gravityWellPosition.current.y;
            
            // Pulsing black hole effect
            const pulseIntensity = 0.8 + 0.2 * Math.sin(currentTime / 100);
            const coreRadius = 15 * pulseIntensity;
            const pullRadius = GRAVITY_PULL_RADIUS * (0.3 + 0.1 * Math.sin(currentTime / 150));
            
            // Draw outer pull radius (semi-transparent purple)
            ctx.save();
            ctx.globalAlpha = 0.2;
            ctx.fillStyle = 'purple';
            ctx.beginPath();
            ctx.arc(gravityX, gravityY, pullRadius, 0, 2 * Math.PI);
            ctx.fill();
            
            // Draw swirling effect
            ctx.globalAlpha = 0.6;
            ctx.strokeStyle = 'rgba(75, 0, 130, 0.8)'; // Indigo
            ctx.lineWidth = 3;
            for (let i = 0; i < 3; i++) {
                const spiralRadius = 30 + i * 15;
                const spiralAngle = (currentTime / 200) + i * (Math.PI / 1.5);
                ctx.beginPath();
                ctx.arc(gravityX, gravityY, spiralRadius, spiralAngle, spiralAngle + Math.PI);
                ctx.stroke();
            }
            
            // Draw black hole core
            ctx.globalAlpha = 1;
            const coreGradient = ctx.createRadialGradient(gravityX, gravityY, 0, gravityX, gravityY, coreRadius);
            coreGradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
            coreGradient.addColorStop(0.7, 'rgba(25, 0, 50, 0.9)');
            coreGradient.addColorStop(1, 'rgba(75, 0, 130, 0.3)');
            ctx.fillStyle = coreGradient;
            ctx.beginPath();
            ctx.arc(gravityX, gravityY, coreRadius, 0, 2 * Math.PI);
            ctx.fill();
            
            // Draw progress ring around the black hole
            const ringRadius = coreRadius + 8;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(gravityX, gravityY, ringRadius, 0, 2 * Math.PI * (1 - progress));
            ctx.stroke();
            
            ctx.restore();
        }

        // Draw gravity well explosion effect
        if (gravityWellExplosion.current) {
            const elapsed = currentTime - gravityWellExplosionStartTime.current;
            const explosionDuration = 500; // 0.5 seconds
            const progress = elapsed / explosionDuration;
            const gravityX = gravityWellPosition.current.x;
            const gravityY = gravityWellPosition.current.y;
            
            if (progress <= 1) {
                // Expanding explosion rings
                const maxRadius = GRAVITY_EXPLOSION_RADIUS;
                const currentRadius = maxRadius * progress;
                const alpha = 1 - progress;
                
                ctx.save();
                
                // Outer explosion ring
                ctx.globalAlpha = alpha * 0.8;
                const explosionGradient = ctx.createRadialGradient(
                    gravityX, gravityY, 0,
                    gravityX, gravityY, currentRadius
                );
                explosionGradient.addColorStop(0, 'rgba(255, 100, 0, 1)');
                explosionGradient.addColorStop(0.4, 'rgba(255, 150, 0, 0.8)');
                explosionGradient.addColorStop(0.7, 'rgba(255, 200, 0, 0.5)');
                explosionGradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
                
                ctx.fillStyle = explosionGradient;
                ctx.beginPath();
                ctx.arc(gravityX, gravityY, currentRadius, 0, 2 * Math.PI);
                ctx.fill();
                
                // Inner bright flash
                ctx.globalAlpha = alpha;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.beginPath();
                ctx.arc(gravityX, gravityY, currentRadius * 0.3, 0, 2 * Math.PI);
                ctx.fill();
                
                // Explosion particles/sparks
                for (let i = 0; i < 12; i++) {
                    const angle = (i / 12) * 2 * Math.PI;
                    const sparkDistance = currentRadius * 0.8;
                    const sparkX = gravityX + Math.cos(angle) * sparkDistance;
                    const sparkY = gravityY + Math.sin(angle) * sparkDistance;
                    
                    ctx.globalAlpha = alpha * 0.8;
                    ctx.fillStyle = 'rgba(255, 200, 0, 0.9)';
                    ctx.beginPath();
                    ctx.arc(sparkX, sparkY, 4, 0, 2 * Math.PI);
                    ctx.fill();
                }
                
                ctx.restore();
            }
        }

        // Draw phase walk progress bar when phase walk ability is active
        if (phaseWalkActive.current) {
            const elapsed = currentTime - phaseWalkStartTime.current;
            const remainingTime = PHASEWALK_DURATION - elapsed;
            const progress = remainingTime / PHASEWALK_DURATION; // Progress from 1 to 0
            
            // Calculate position with compact spacing (12px between bars)
            const barWidth = 100;
            const barHeight = 6;
            const barX = playerCenterX - barWidth / 2;
            let barY = playerRef.current.y - 20; // Default position
            
            // Adjust position based on other active abilities (12px spacing)
            if (immortalityAbilityActive.current && speedAbilityActive.current && reloadTimeRef.current === RELOADTIME_ABILITY_BOOST) {
                barY = playerRef.current.y - 58; // 12px above reload bar
            } else if ((immortalityAbilityActive.current && speedAbilityActive.current) || 
                      (immortalityAbilityActive.current && reloadTimeRef.current === RELOADTIME_ABILITY_BOOST) || 
                      (speedAbilityActive.current && reloadTimeRef.current === RELOADTIME_ABILITY_BOOST)) {
                barY = playerRef.current.y - 46; // 12px above the second bar
            } else if (immortalityAbilityActive.current || speedAbilityActive.current || reloadTimeRef.current === RELOADTIME_ABILITY_BOOST) {
                barY = playerRef.current.y - 34; // 12px above the first bar
            }
            
            // Add a ghostly purple glow effect around the player when phase walk is active
            ctx.save();
            ctx.shadowColor = 'rgba(128, 0, 128, 0.8)';
            ctx.shadowBlur = 25;
            ctx.strokeStyle = 'rgba(128, 0, 128, 0.6)'; // Purple
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(playerCenterX, playerCenterY, PLAYER_COLLISION_RADIUS + 8, 0, 2 * Math.PI);
            ctx.stroke();
            
            // Add flickering ghost effect
            const ghostAlpha = 0.3 + 0.2 * Math.sin(currentTime / 100);
            ctx.globalAlpha = ghostAlpha;
            ctx.strokeStyle = 'rgba(200, 150, 255, 0.8)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(playerCenterX, playerCenterY, PLAYER_COLLISION_RADIUS + 15, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.restore();
            
            // Draw progress bar background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);
            
            // Draw progress bar border
            ctx.strokeStyle = 'rgba(128, 0, 128, 0.8)'; // Purple border
            ctx.lineWidth = 1;
            ctx.strokeRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);
            
            // Draw progress bar fill with phase-themed colors
            const fillWidth = barWidth * progress;
            const phaseGradient = ctx.createLinearGradient(barX, barY, barX + barWidth, barY);
            phaseGradient.addColorStop(0, 'rgba(128, 0, 128, 0.9)'); // Purple
            phaseGradient.addColorStop(0.5, 'rgba(147, 0, 211, 0.9)'); // Dark violet
            phaseGradient.addColorStop(1, 'rgba(75, 0, 130, 0.9)'); // Indigo
            
            ctx.fillStyle = phaseGradient;
            ctx.fillRect(barX, barY, fillWidth, barHeight);
            
            // Draw remaining time text (smaller font)
            const timeLeft = Math.ceil(remainingTime / 1000);
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`Phase: ${timeLeft}s`, playerCenterX, barY - 4);
            ctx.textAlign = 'left'; // Reset text alignment
        }

        // Draw score boost +100 text effect when active
        if (scoreBoostEffectActive.current) {
            const elapsed = currentTime - scoreBoostEffectStartTime.current;
            const effectDuration = 1000; // 1 second effect
            const progress = elapsed / effectDuration;
            
            if (progress <= 1) {
                // Text rises and fades
                const yOffset = -30 - (progress * 50); // Rises 50px
                const alpha = 1 - progress; // Fades out
                const scale = 1 + (progress * 0.5); // Grows slightly
                
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.translate(playerCenterX, playerCenterY + yOffset);
                ctx.scale(scale, scale);
                
                // Golden text with glow
                ctx.shadowColor = 'gold';
                ctx.shadowBlur = 10;
                ctx.fillStyle = 'gold';
                ctx.font = 'bold 24px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('+100', 0, 0);
                
                // White outline for better visibility
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 2;
                ctx.strokeText('+100', 0, 0);
                
                ctx.restore();
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

        // Bomber enemy spawning
        const bomberBaseSpawnInterval = SPAWN_BOMBER_ENEMY_TIME;
        const bomberMinSpawnInterval = SPAWN_BOMBER_ENEMY_TIME_MIN;
        const currentBomberSpawnInterval = bomberBaseSpawnInterval / difficulty.current;
        const bomberSpawnInterval = Math.max(bomberMinSpawnInterval, currentBomberSpawnInterval);
        
        if (currentTime - lastBomberEnemySpawnTime.current > bomberSpawnInterval) {
            lastBomberEnemySpawnTime.current = currentTime;
            const side = Math.floor(Math.random() * 4);
            let x, y;

            switch (side) {
                case 0: /* top */ x = Math.random() * window.innerWidth; y = 0; break;
                case 1: /* right */ x = window.innerWidth; y = Math.random() * window.innerHeight; break;
                case 2: /* bottom */ x = Math.random() * window.innerWidth; y = window.innerHeight; break;
                case 3: /* left */ x = 0; y = Math.random() * window.innerHeight; break;
            }
            bomberEnemyRef.current.push({
                x: x, y: y, width: 120, height: 120, color: "orange",
                spawnTime: currentTime, // Track when it was spawned for explosion timer
                exploded: false,
            });
        }

        // Teleporter enemy spawning
        const teleporterBaseSpawnInterval = SPAWN_TELEPORTER_ENEMY_TIME;
        const teleporterMinSpawnInterval = SPAWN_TELEPORTER_ENEMY_TIME_MIN;
        const currentTeleporterSpawnInterval = teleporterBaseSpawnInterval / difficulty.current;
        const teleporterSpawnInterval = Math.max(teleporterMinSpawnInterval, currentTeleporterSpawnInterval);
        
        if (currentTime - lastTeleporterEnemySpawnTime.current > teleporterSpawnInterval) {
            lastTeleporterEnemySpawnTime.current = currentTime;
            const side = Math.floor(Math.random() * 4);
            let x, y;

            switch (side) {
                case 0: /* top */ x = Math.random() * window.innerWidth; y = 0; break;
                case 1: /* right */ x = window.innerWidth; y = Math.random() * window.innerHeight; break;
                case 2: /* bottom */ x = Math.random() * window.innerWidth; y = window.innerHeight; break;
                case 3: /* left */ x = 0; y = Math.random() * window.innerHeight; break;
            }
            teleporterEnemyRef.current.push({
                x: x, y: y, width: 150, height: 120, color: "cyan",
                teleporting: false,
                teleportStartTime: 0,
            });
        }



        // Update player position based on keys pressed
        if (keys.current["ArrowUp"] || keys.current["w"]){
            if (playerRef.current.y > 0){
                playerRef.current.y -= playerRef.current.speed;
            }
        }
        if (keys.current["ArrowDown"] || keys.current["s"]){

            if (playerRef.current.y +playerRef.current.height < window.innerHeight) {
                playerRef.current.y += playerRef.current.speed;
            }

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
                bomberEnemySpeed.current = BOMBER_ENEMY_SPEED * SPEED_ENEMY_MULTIPLIER * responsiveMultiplier;
                teleporterEnemySpeed.current = TELEPORTER_ENEMY_SPEED * SPEED_ENEMY_MULTIPLIER * responsiveMultiplier;
                teleporterEnemyBulletSpeed.current = TELEPORTER_BULLET_SPEED * SPEED_ENEMY_MULTIPLIER * responsiveMultiplier;
            } else if (phaseWalkActive.current) {
                // Phase walk is active - increased player speed, normal enemy speeds
                playerRef.current.speed = PLAYER_SPEED * PHASEWALK_SPEED_MULTIPLIER * responsiveMultiplier;
                bulletSpeed.current = PLAYER_BULLET_SPEED * responsiveMultiplier;
                basicEnemySpeed.current = BASIC_ENEMY_SPEED * responsiveMultiplier;
                enemyBulletSpeed.current = BASIC_ENEMY_BULLET_SPEED * responsiveMultiplier;
                trippleShootEnemySpeed.current = TRIPPLESHOOT_ENEMY_SPEED * responsiveMultiplier;
                trippleShootEnemyBulletSpeed.current = TRIPPLESHOOT_ENEMY_BULLET_SPEED * responsiveMultiplier;
                bomberEnemySpeed.current = BOMBER_ENEMY_SPEED * responsiveMultiplier;
                teleporterEnemySpeed.current = TELEPORTER_ENEMY_SPEED * responsiveMultiplier;
                teleporterEnemyBulletSpeed.current = TELEPORTER_BULLET_SPEED * responsiveMultiplier;
            } else {
                // Normal speeds when moving with responsive scaling
                playerRef.current.speed = PLAYER_SPEED * responsiveMultiplier;
                bulletSpeed.current = PLAYER_BULLET_SPEED * responsiveMultiplier;
                basicEnemySpeed.current = BASIC_ENEMY_SPEED * responsiveMultiplier;
                enemyBulletSpeed.current = BASIC_ENEMY_BULLET_SPEED * responsiveMultiplier;
                trippleShootEnemySpeed.current = TRIPPLESHOOT_ENEMY_SPEED * responsiveMultiplier;
                trippleShootEnemyBulletSpeed.current = TRIPPLESHOOT_ENEMY_BULLET_SPEED * responsiveMultiplier;
                bomberEnemySpeed.current = BOMBER_ENEMY_SPEED * responsiveMultiplier;
                teleporterEnemySpeed.current = TELEPORTER_ENEMY_SPEED * responsiveMultiplier;
                teleporterEnemyBulletSpeed.current = TELEPORTER_BULLET_SPEED * responsiveMultiplier;
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
                bomberEnemySpeed.current = BOMBER_ENEMY_SPEED_SLOW * SPEED_ENEMY_MULTIPLIER * responsiveMultiplier;
                teleporterEnemySpeed.current = TELEPORTER_ENEMY_SPEED_SLOW * SPEED_ENEMY_MULTIPLIER * responsiveMultiplier;
                teleporterEnemyBulletSpeed.current = TELEPORTER_BULLET_SPEED_SLOW * SPEED_ENEMY_MULTIPLIER * responsiveMultiplier;
            } else {
                // Slow speeds when not moving (normal Time is Magic behavior) with responsive scaling
                playerRef.current.speed = PLAYER_SPEED_SLOW * responsiveMultiplier;
                bulletSpeed.current = PLAYER_BULLET_SPEED_SLOW * responsiveMultiplier;
                basicEnemySpeed.current = BASIC_ENEMY_SPEED_SLOW * responsiveMultiplier;
                enemyBulletSpeed.current = BASIC_ENEMY_BULLET_SPEED_SLOW * responsiveMultiplier;
                trippleShootEnemySpeed.current = TRIPPLESHOOT_ENEMY_SPEED_SLOW * responsiveMultiplier;
                trippleShootEnemyBulletSpeed.current = TRIPPLESHOOT_ENEMY_BULLET_SPEED_SLOW * responsiveMultiplier;
                bomberEnemySpeed.current = BOMBER_ENEMY_SPEED_SLOW * responsiveMultiplier;
                teleporterEnemySpeed.current = TELEPORTER_ENEMY_SPEED_SLOW * responsiveMultiplier;
                teleporterEnemyBulletSpeed.current = TELEPORTER_BULLET_SPEED_SLOW * responsiveMultiplier;
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

        // Draw arrows (Archer)
        arrows.current.forEach((arrow, index) => {
            arrow.x += arrow.dirX * ARROW_SPEED;
            arrow.y += arrow.dirY * ARROW_SPEED;

            // Draw arrow with green color and longer sprite
            ctx.save();
            const arrowLength = 60; // Longer than bullets
            const arrowWidth = 8;
            
            ctx.translate(arrow.x, arrow.y);
            ctx.rotate(arrow.angle);
            
            // Draw arrow shaft
            ctx.fillStyle = "rgba(0, 200, 0, 0.9)"; // Green arrow
            ctx.fillRect(-arrowLength/2, -arrowWidth/2, arrowLength, arrowWidth);
            
            // Draw arrow head
            ctx.fillStyle = "rgba(0, 150, 0, 1)";
            ctx.beginPath();
            ctx.moveTo(arrowLength/2, 0);
            ctx.lineTo(arrowLength/2 - 15, -8);
            ctx.lineTo(arrowLength/2 - 15, 8);
            ctx.closePath();
            ctx.fill();
            
            // Draw arrow fletching
            ctx.fillStyle = "rgba(139, 69, 19, 0.8)"; // Brown fletching
            ctx.fillRect(-arrowLength/2, -6, 12, 12);
            
            ctx.restore();

            // Draw arrow collision boundary (debug visualization)
            if (showCollision) {
                const arrowRadius = 20;
                ctx.strokeStyle = "rgba(0, 255, 0, 0.6)"; // Green
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(arrow.x, arrow.y, arrowRadius, 0, 2 * Math.PI);
                ctx.stroke();
            }
        });

        // Remove arrows that are out of bounds
        arrows.current = arrows.current.filter((arrow) => {
            return arrow.x >= -100 && arrow.x <= window.innerWidth + 100 && arrow.y >= -100 && arrow.y <= window.innerHeight + 100;
        });

        // Draw spells (Mage)
        spells.current.forEach((spell, index) => {
            const spellAge = currentTime - spell.startTime;
            const spellProgress = spellAge / spell.duration;
            
            if (spellProgress <= 1 && spell.active) {
                // Expanding magic circle effect
                const currentRadius = spell.radius * spellProgress;
                const alpha = 1 - spellProgress;
                
                ctx.save();
                
                // Draw outer magic circle
                const outerGradient = ctx.createRadialGradient(
                    spell.x, spell.y, 0,
                    spell.x, spell.y, currentRadius
                );
                outerGradient.addColorStop(0, `rgba(128, 0, 255, ${alpha * 0.3})`); // Purple center
                outerGradient.addColorStop(0.7, `rgba(255, 0, 255, ${alpha * 0.6})`); // Magenta
                outerGradient.addColorStop(1, `rgba(138, 43, 226, ${alpha * 0.1})`); // Blue violet edge
                
                ctx.fillStyle = outerGradient;
                ctx.beginPath();
                ctx.arc(spell.x, spell.y, currentRadius, 0, 2 * Math.PI);
                ctx.fill();
                
                // Draw inner energy core
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
                ctx.beginPath();
                ctx.arc(spell.x, spell.y, currentRadius * 0.3, 0, 2 * Math.PI);
                ctx.fill();
                
                // Draw magical particles
                for (let i = 0; i < 12; i++) {
                    const particleAngle = (i / 12) * Math.PI * 2 + (spellAge / 100);
                    const particleDistance = currentRadius * (0.6 + 0.3 * Math.sin(spellAge / 50 + i));
                    const particleX = spell.x + Math.cos(particleAngle) * particleDistance;
                    const particleY = spell.y + Math.sin(particleAngle) * particleDistance;
                    
                    ctx.fillStyle = `rgba(255, 255, 0, ${alpha * 0.9})`;
                    ctx.beginPath();
                    ctx.arc(particleX, particleY, 4, 0, 2 * Math.PI);
                    ctx.fill();
                }
                
                // Draw spell border
                ctx.strokeStyle = `rgba(138, 43, 226, ${alpha})`;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(spell.x, spell.y, currentRadius, 0, 2 * Math.PI);
                ctx.stroke();
                
                ctx.restore();
                
                // Draw spell collision boundary (debug visualization)
                if (showCollision) {
                    ctx.strokeStyle = "rgba(255, 0, 255, 0.6)"; // Magenta
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(spell.x, spell.y, currentRadius, 0, 2 * Math.PI);
                    ctx.stroke();
                }
            } else {
                spell.active = false;
            }
        });

        // Remove inactive spells
        spells.current = spells.current.filter((spell) => spell.active);

        // Draw basic enemies
        basicEnemyRef.current.forEach((enemy, index) => {
            // Move enemy towards player
            let dx = (playerRef.current.x + playerRef.current.width / 2) - (enemy.x + enemy.width / 2);
            let dy = (playerRef.current.y + playerRef.current.height / 2) - (enemy.y + enemy.height / 2);
            
            // Apply gravity well pull if active
            if (gravityWellActive.current) {
                const gravityX = gravityWellPosition.current.x;
                const gravityY = gravityWellPosition.current.y;
                const enemyCenterX = enemy.x + enemy.width / 2;
                const enemyCenterY = enemy.y + enemy.height / 2;
                const gravityDistance = Math.sqrt((enemyCenterX - gravityX) ** 2 + (enemyCenterY - gravityY) ** 2);
                
                if (gravityDistance <= GRAVITY_PULL_RADIUS) {
                    // Pull towards gravity well
                    const gravityDx = gravityX - enemyCenterX;
                    const gravityDy = gravityY - enemyCenterY;
                    const gravityLength = Math.sqrt(gravityDx * gravityDx + gravityDy * gravityDy);
                    
                    if (gravityLength > 0) {
                        const pullStrength = GRAVITY_PULL_STRENGTH * (1 - gravityDistance / GRAVITY_PULL_RADIUS);
                        dx = gravityDx / gravityLength * pullStrength;
                        dy = gravityDy / gravityLength * pullStrength;
                    }
                }
            }
            
            const length = Math.sqrt(dx * dx + dy * dy);
            const dirX = length > 0 ? dx / length : 0;
            const dirY = length > 0 ? dy / length : 0;

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
            const dirX = length > 0 ? dx / length : 0;
            const dirY = length > 0 ? dy / length : 0;

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

        // Draw bomber enemies
        bomberEnemyRef.current.forEach((enemy, index) => {
            const currentTime = performance.now();
            const timeAlive = currentTime - enemy.spawnTime;
            
            // Move bomber towards player (slower movement)
            const dx = (playerRef.current.x + playerRef.current.width / 2) - (enemy.x + enemy.width / 2);
            const dy = (playerRef.current.y + playerRef.current.height / 2) - (enemy.y + enemy.height / 2);
            const length = Math.sqrt(dx * dx + dy * dy);
            const dirX = dx / length;
            const dirY = dy / length;

            enemy.x += dirX * bomberEnemySpeed.current;
            enemy.y += dirY * bomberEnemySpeed.current;

            const enemyCenterX = enemy.x + enemy.width / 2;
            const enemyCenterY = enemy.y + enemy.height / 2;
            
            // Check for explosion timing
            const timeUntilExplosion = BOMBER_FUSE_TIME - timeAlive;
            const isWarning = timeUntilExplosion <= BOMBER_WARNING_TIME;
            
            // Explode after fuse time
            if (timeAlive >= BOMBER_FUSE_TIME && !enemy.exploded) {
                enemy.exploded = true;
                
                // Create explosion effect and damage area
                const playerCenterX = playerRef.current.x + playerRef.current.width / 2;
                const playerCenterY = playerRef.current.y + playerRef.current.height / 2;
                const distanceToPlayer = Math.sqrt((enemyCenterX - playerCenterX) ** 2 + (enemyCenterY - playerCenterY) ** 2);
                
                // Check if player is in explosion radius
                if (distanceToPlayer <= BOMBER_EXPLOSION_RADIUS && !immortalityAbilityActive.current && !phaseWalkActive.current) {
                    looseRef.current = true;
                    setLoose(true);
                }
                
                // Remove other enemies in explosion radius
                basicEnemyRef.current = basicEnemyRef.current.filter(otherEnemy => {
                    const otherCenterX = otherEnemy.x + otherEnemy.width / 2;
                    const otherCenterY = otherEnemy.y + otherEnemy.height / 2;
                    const distanceToOther = Math.sqrt((enemyCenterX - otherCenterX) ** 2 + (enemyCenterY - otherCenterY) ** 2);
                    return distanceToOther > BOMBER_EXPLOSION_RADIUS;
                });
                
                trippleShootEnemyRef.current = trippleShootEnemyRef.current.filter(otherEnemy => {
                    const otherCenterX = otherEnemy.x + otherEnemy.width / 2;
                    const otherCenterY = otherEnemy.y + otherEnemy.height / 2;
                    const distanceToOther = Math.sqrt((enemyCenterX - otherCenterX) ** 2 + (enemyCenterY - otherCenterY) ** 2);
                    return distanceToOther > BOMBER_EXPLOSION_RADIUS;
                });
                
                // Mark for removal
                setTimeout(() => {
                    bomberEnemyRef.current.splice(index, 1);
                }, 100);
            }
            
            // Draw explosion effect
            if (enemy.exploded) {
                ctx.save();
                const explosionProgress = Math.min((performance.now() - (enemy.spawnTime + BOMBER_FUSE_TIME)) / 300, 1);
                const explosionRadius = BOMBER_EXPLOSION_RADIUS * explosionProgress;
                
                // Create explosion gradient
                const explosionGradient = ctx.createRadialGradient(enemyCenterX, enemyCenterY, 0, enemyCenterX, enemyCenterY, explosionRadius);
                explosionGradient.addColorStop(0, 'rgba(255, 255, 0, 0.8)');
                explosionGradient.addColorStop(0.3, 'rgba(255, 165, 0, 0.6)');
                explosionGradient.addColorStop(0.7, 'rgba(255, 69, 0, 0.4)');
                explosionGradient.addColorStop(1, 'rgba(255, 0, 0, 0.1)');
                
                ctx.fillStyle = explosionGradient;
                ctx.beginPath();
                ctx.arc(enemyCenterX, enemyCenterY, explosionRadius, 0, 2 * Math.PI);
                ctx.fill();
                ctx.restore();
            } else {
                // Draw bomber enemy with warning effects
                ctx.save();
                
                // Warning flash effect
                if (isWarning) {
                    const flashIntensity = Math.sin((performance.now() % 200) / 200 * Math.PI * 2) * 0.5 + 0.5;
                    ctx.shadowColor = 'red';
                    ctx.shadowBlur = 20 * flashIntensity;
                }
                
                if (bomberImageRef.current) {
                    // Add red tint when warning
                    if (isWarning) {
                        ctx.filter = 'hue-rotate(0deg) saturate(2) brightness(1.2)';
                    }
                    
                    ctx.drawImage(bomberImageRef.current, enemy.x, enemy.y, enemy.width, enemy.height);
                    ctx.filter = 'none';
                } else {
                    ctx.fillStyle = isWarning ? "red" : enemy.color;
                    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
                }
                
                ctx.restore();
                
                // Draw countdown timer
                const timeLeftSeconds = Math.ceil(timeUntilExplosion / 1000);
                if (timeLeftSeconds > 0) {
                    ctx.fillStyle = isWarning ? "red" : "white";
                    ctx.font = "16px Arial";
                    ctx.textAlign = "center";
                    ctx.fillText(timeLeftSeconds.toString(), enemyCenterX, enemyCenterY - enemy.height/2 - 10);
                }
            }
            
            // Draw collision boundary (debug visualization)
            if (showCollision && !enemy.exploded) {
                const enemyRadius = 40;
                ctx.strokeStyle = "rgba(255, 165, 0, 0.6)"; // Orange
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(enemyCenterX, enemyCenterY, enemyRadius, 0, 2 * Math.PI);
                ctx.stroke();
            }
        });

        // Draw teleporter enemies
        teleporterEnemyRef.current.forEach((enemy, index) => {
            // Move towards player when not teleporting
            if (!enemy.teleporting) {
                const dx = (playerRef.current.x + playerRef.current.width / 2) - (enemy.x + enemy.width / 2);
                const dy = (playerRef.current.y + playerRef.current.height / 2) - (enemy.y + enemy.height / 2);
                const length = Math.sqrt(dx * dx + dy * dy);
                const dirX = length > 0 ? dx / length : 0;
                const dirY = length > 0 ? dy / length : 0;

                enemy.x += dirX * teleporterEnemySpeed.current;
                enemy.y += dirY * teleporterEnemySpeed.current;
            }

            const enemyCenterX = enemy.x + enemy.width / 2;
            const enemyCenterY = enemy.y + enemy.height / 2;
            
            // Draw teleporter enemy with special effects
            ctx.save();
            
            if (enemy.teleporting) {
                // Teleporting effect - flickering and particles
                const teleportProgress = (performance.now() - enemy.teleportStartTime) / 200;
                const alpha = Math.sin(teleportProgress * Math.PI * 10) * 0.5 + 0.5;
                ctx.globalAlpha = alpha;
                
                // Add cyan glow during teleport
                ctx.shadowColor = 'cyan';
                ctx.shadowBlur = 30;
            } else {
                // Normal state with subtle cyan glow
                ctx.shadowColor = 'cyan';
                ctx.shadowBlur = 10;
            }
            
            if (teleporterImageRef.current) {
                // Add cyan tint to distinguish from basic enemies
                ctx.filter = 'hue-rotate(180deg) saturate(1.5) brightness(1.1)';
                ctx.drawImage(teleporterImageRef.current, enemy.x, enemy.y, enemy.width, enemy.height);
                ctx.filter = 'none';
            } else {
                ctx.fillStyle = enemy.teleporting ? "lightcyan" : enemy.color;
                ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            }
            
            ctx.restore();
            
            // Draw teleportation particles when teleporting
            if (enemy.teleporting) {
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const distance = 50 + Math.sin(performance.now() / 100 + i) * 20;
                    const particleX = enemyCenterX + Math.cos(angle) * distance;
                    const particleY = enemyCenterY + Math.sin(angle) * distance;
                    
                    ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';
                    ctx.beginPath();
                    ctx.arc(particleX, particleY, 3, 0, 2 * Math.PI);
                    ctx.fill();
                }
            }
            
            // Draw collision boundary (debug visualization)
            if (showCollision && !enemy.teleporting) {
                const enemyRadius = 35;
                ctx.strokeStyle = "rgba(0, 255, 255, 0.6)"; // Cyan
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(enemyCenterX, enemyCenterY, enemyRadius, 0, 2 * Math.PI);
                ctx.stroke();
            }
        });

        // Update and draw teleporter enemy bullets with homing behavior
        teleporterEnemyBulletsRef.current.forEach((bullet, index) => {
            // Homing behavior - gradually turn towards player
            if (bullet.homing) {
                const playerCenterX = playerRef.current.x + playerRef.current.width / 2;
                const playerCenterY = playerRef.current.y + playerRef.current.height / 2;
                
                const dx = playerCenterX - bullet.x;
                const dy = playerCenterY - bullet.y;
                const length = Math.sqrt(dx * dx + dy * dy);
                
                if (length > 0) {
                    const targetDirX = dx / length;
                    const targetDirY = dy / length;
                    
                    // Gradually adjust direction towards player
                    bullet.dirX += (targetDirX - bullet.dirX) * TELEPORTER_HOMING_STRENGTH;
                    bullet.dirY += (targetDirY - bullet.dirY) * TELEPORTER_HOMING_STRENGTH;
                    
                    // Normalize direction vector
                    const newLength = Math.sqrt(bullet.dirX * bullet.dirX + bullet.dirY * bullet.dirY);
                    bullet.dirX /= newLength;
                    bullet.dirY /= newLength;
                }
            }
            
            bullet.x += bullet.dirX * teleporterEnemyBulletSpeed.current;
            bullet.y += bullet.dirY * teleporterEnemyBulletSpeed.current;

            // Draw homing bullet with special effect
            if (goblinBulletImageRef.current) {
                const bulletAngle = Math.atan2(bullet.dirY, bullet.dirX);
                const bulletSize = 80; // Smaller than normal bullets
                
                ctx.save();
                
                // Add cyan glow to homing bullets
                ctx.shadowColor = 'cyan';
                ctx.shadowBlur = 15;
                
                ctx.translate(bullet.x, bullet.y);
                ctx.rotate(bulletAngle);
                
                // Add cyan tint
                ctx.filter = 'hue-rotate(180deg) saturate(1.5) brightness(1.2)';
                ctx.drawImage(goblinBulletImageRef.current, -bulletSize/2, -bulletSize/2, bulletSize, bulletSize);
                ctx.filter = 'none';
                
                ctx.restore();
                
                // Draw homing trail
                const trailLength = 20;
                ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(bullet.x, bullet.y);
                ctx.lineTo(bullet.x - bullet.dirX * trailLength, bullet.y - bullet.dirY * trailLength);
                ctx.stroke();
            } else {
                ctx.fillStyle = "cyan";
                ctx.fillRect(bullet.x - 4, bullet.y - 4, 8, 8);
            }
            
            // Draw bullet collision boundary (debug visualization)
            if (showCollision) {
                const bulletRadius = 15;
                ctx.strokeStyle = "rgba(0, 255, 255, 0.4)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(bullet.x, bullet.y, bulletRadius, 0, 2 * Math.PI);
                ctx.stroke();
            }
        });


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

        // Remove teleporter enemy bullets that are out of bounds
        teleporterEnemyBulletsRef.current = teleporterEnemyBulletsRef.current.filter((bullet) => {
            return bullet.x >= 0 && bullet.x <= window.innerWidth && bullet.y >= 0 && bullet.y <= window.innerHeight;
        });


        // collision beetwen player and tripple shoot enemy bullets (using circular collision)
        trippleShootEnemyBulletsRef.current.forEach((bullet, index) => {
            const playerCenterX = playerRef.current.x + playerRef.current.width / 2;
            const playerCenterY = playerRef.current.y + playerRef.current.height / 2;
            
            if (circularCollision(playerCenterX, playerCenterY, PLAYER_COLLISION_RADIUS, bullet.x, bullet.y, 10)) {
                trippleShootEnemyBulletsRef.current.splice(index, 1);
                // Only lose if not immortal or phase walking
                if (!immortalityAbilityActive.current && !phaseWalkActive.current) {
                    looseRef.current = true;
                    setLoose(true);
                }
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
                // Only lose if not immortal or phase walking
                if (!immortalityAbilityActive.current && !phaseWalkActive.current) {
                    looseRef.current = true;
                    setLoose(true);
                }
            }
        });

        // Collisions between player and triple shoot enemies
        trippleShootEnemyRef.current.forEach((enemy, index) => {
            const enemyCenterX = enemy.x + enemy.width / 2;
            const enemyCenterY = enemy.y + enemy.height / 2;
            const playerCenterX = playerRef.current.x + playerRef.current.width / 2;
            const playerCenterY = playerRef.current.y + playerRef.current.height / 2;
            
            if (circularCollision(playerCenterX, playerCenterY, PLAYER_COLLISION_RADIUS, enemyCenterX, enemyCenterY, 15)) {
                // Only lose if not immortal or phase walking or phase walking
                if (!immortalityAbilityActive.current && !phaseWalkActive.current && !phaseWalkActive.current) {
                    looseRef.current = true;
                    setLoose(true);
                }
            }
        });

        // Collisions between player and basic enemy bullets (using circular collision)
        basicEnemyBulletsRef.current.forEach((bullet, index) => {
            const playerCenterX = playerRef.current.x + playerRef.current.width / 2;
            const playerCenterY = playerRef.current.y + playerRef.current.height / 2;
            
            if (circularCollision(playerCenterX, playerCenterY, PLAYER_COLLISION_RADIUS, bullet.x, bullet.y, GOBLIN_BULLET_RADIUS)) {
                basicEnemyBulletsRef.current.splice(index, 1);
                // Only lose if not immortal or phase walking
                if (!immortalityAbilityActive.current && !phaseWalkActive.current) {
                    looseRef.current = true;
                    setLoose(true);
                }
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

        // Slash collision detection for Rapunzel
        if (currentCharacter.combatType === 'slash' && slashActive.current) {
            const playerCenterX = playerRef.current.x + playerRef.current.width / 2;
            const playerCenterY = playerRef.current.y + playerRef.current.height / 2;
            
            // Check slash collision with basic enemies
            basicEnemyRef.current.forEach((enemy, eIndex) => {
                const enemyHeadX = enemy.x + enemy.width / 2;
                const enemyHeadY = enemy.y + enemy.height / 4;
                const distance = Math.sqrt((enemyHeadX - playerCenterX) ** 2 + (enemyHeadY - playerCenterY) ** 2);
                
                if (distance <= SLASH_RANGE) {
                    // Check if enemy is within slash arc
                    const enemyAngle = Math.atan2(enemyHeadY - playerCenterY, enemyHeadX - playerCenterX);
                    const angleDiff = Math.abs(enemyAngle - slashDirection.current);
                    const normalizedAngleDiff = Math.min(angleDiff, 2 * Math.PI - angleDiff);
                    
                    if (normalizedAngleDiff <= SLASH_ANGLE_SPREAD / 2) {
                        basicEnemyRef.current.splice(eIndex, 1);
                        score.current += 10;
                        difficulty.current += Math.floor(score.current / 100);
                    }
                }
            });
            
            // Check slash collision with triple shoot enemies
            trippleShootEnemyRef.current.forEach((enemy, eIndex) => {
                const enemyCenterX = enemy.x + enemy.width / 2;
                const enemyCenterY = enemy.y + enemy.height / 2;
                const distance = Math.sqrt((enemyCenterX - playerCenterX) ** 2 + (enemyCenterY - playerCenterY) ** 2);
                
                if (distance <= SLASH_RANGE) {
                    const enemyAngle = Math.atan2(enemyCenterY - playerCenterY, enemyCenterX - playerCenterX);
                    const angleDiff = Math.abs(enemyAngle - slashDirection.current);
                    const normalizedAngleDiff = Math.min(angleDiff, 2 * Math.PI - angleDiff);
                    
                    if (normalizedAngleDiff <= SLASH_ANGLE_SPREAD / 2) {
                        trippleShootEnemyRef.current.splice(eIndex, 1);
                        score.current += 15;
                        difficulty.current += Math.floor(score.current / 100);
                    }
                }
            });
            
            // Check slash collision with bomber enemies
            bomberEnemyRef.current.forEach((enemy, eIndex) => {
                if (!enemy.exploded) {
                    const enemyCenterX = enemy.x + enemy.width / 2;
                    const enemyCenterY = enemy.y + enemy.height / 2;
                    const distance = Math.sqrt((enemyCenterX - playerCenterX) ** 2 + (enemyCenterY - playerCenterY) ** 2);
                    
                    if (distance <= SLASH_RANGE) {
                        const enemyAngle = Math.atan2(enemyCenterY - playerCenterY, enemyCenterX - playerCenterX);
                        const angleDiff = Math.abs(enemyAngle - slashDirection.current);
                        const normalizedAngleDiff = Math.min(angleDiff, 2 * Math.PI - angleDiff);
                        
                        if (normalizedAngleDiff <= SLASH_ANGLE_SPREAD / 2) {
                            bomberEnemyRef.current.splice(eIndex, 1);
                            score.current += 20;
                            difficulty.current += Math.floor(score.current / 100);
                        }
                    }
                }
            });
            
            // Check slash collision with teleporter enemies (when not teleporting)
            teleporterEnemyRef.current.forEach((enemy, eIndex) => {
                if (!enemy.teleporting) {
                    const enemyCenterX = enemy.x + enemy.width / 2;
                    const enemyCenterY = enemy.y + enemy.height / 2;
                    const distance = Math.sqrt((enemyCenterX - playerCenterX) ** 2 + (enemyCenterY - playerCenterY) ** 2);
                    
                    if (distance <= SLASH_RANGE) {
                        const enemyAngle = Math.atan2(enemyCenterY - playerCenterY, enemyCenterX - playerCenterX);
                        const angleDiff = Math.abs(enemyAngle - slashDirection.current);
                        const normalizedAngleDiff = Math.min(angleDiff, 2 * Math.PI - angleDiff);
                        
                        if (normalizedAngleDiff <= SLASH_ANGLE_SPREAD / 2) {
                            teleporterEnemyRef.current.splice(eIndex, 1);
                            score.current += 25;
                            difficulty.current += Math.floor(score.current / 100);
                        }
                    }
                }
            });
            
            // Check slash collision with enemy bullets (deflect them)
            basicEnemyBulletsRef.current.forEach((bullet, bIndex) => {
                const distance = Math.sqrt((bullet.x - playerCenterX) ** 2 + (bullet.y - playerCenterY) ** 2);
                
                if (distance <= SLASH_RANGE) {
                    const bulletAngle = Math.atan2(bullet.y - playerCenterY, bullet.x - playerCenterX);
                    const angleDiff = Math.abs(bulletAngle - slashDirection.current);
                    const normalizedAngleDiff = Math.min(angleDiff, 2 * Math.PI - angleDiff);
                    
                    if (normalizedAngleDiff <= SLASH_ANGLE_SPREAD / 2) {
                        basicEnemyBulletsRef.current.splice(bIndex, 1);
                    }
                }
            });
            
            // Check slash collision with teleporter bullets (deflect them)
            teleporterEnemyBulletsRef.current.forEach((bullet, bIndex) => {
                const distance = Math.sqrt((bullet.x - playerCenterX) ** 2 + (bullet.y - playerCenterY) ** 2);
                
                if (distance <= SLASH_RANGE) {
                    const bulletAngle = Math.atan2(bullet.y - playerCenterY, bullet.x - playerCenterX);
                    const angleDiff = Math.abs(bulletAngle - slashDirection.current);
                    const normalizedAngleDiff = Math.min(angleDiff, 2 * Math.PI - angleDiff);
                    
                    if (normalizedAngleDiff <= SLASH_ANGLE_SPREAD / 2) {
                        teleporterEnemyBulletsRef.current.splice(bIndex, 1);
                    }
                }
            });
            
            // Check slash collision with triple shoot bullets (deflect them)
            trippleShootEnemyBulletsRef.current.forEach((bullet, bIndex) => {
                const distance = Math.sqrt((bullet.x - playerCenterX) ** 2 + (bullet.y - playerCenterY) ** 2);
                
                if (distance <= SLASH_RANGE) {
                    const bulletAngle = Math.atan2(bullet.y - playerCenterY, bullet.x - playerCenterX);
                    const angleDiff = Math.abs(bulletAngle - slashDirection.current);
                    const normalizedAngleDiff = Math.min(angleDiff, 2 * Math.PI - angleDiff);
                    
                    if (normalizedAngleDiff <= SLASH_ANGLE_SPREAD / 2) {
                        trippleShootEnemyBulletsRef.current.splice(bIndex, 1);
                    }
                }
            });
        }

        // Arrow collision detection for Archer (piercing arrows)
        if (currentCharacter.combatType === 'arrows') {
            arrows.current.forEach((arrow, arrowIndex) => {
                // Check collision with basic enemies
                basicEnemyRef.current.forEach((enemy, eIndex) => {
                    const enemyHeadX = enemy.x + enemy.width / 2;
                    const enemyHeadY = enemy.y + enemy.height / 4;
                    
                    if (circularCollision(arrow.x, arrow.y, 20, enemyHeadX, enemyHeadY, 40)) {
                        basicEnemyRef.current.splice(eIndex, 1);
                        score.current += 10;
                        difficulty.current += Math.floor(score.current / 100);
                        
                        arrow.pierceCount++;
                        if (arrow.pierceCount >= arrow.maxPierce) {
                            arrows.current.splice(arrowIndex, 1);
                        }
                    }
                });
                
                // Check collision with triple shoot enemies
                trippleShootEnemyRef.current.forEach((enemy, eIndex) => {
                    const enemyCenterX = enemy.x + enemy.width / 2;
                    const enemyCenterY = enemy.y + enemy.height / 2;
                    
                    if (circularCollision(arrow.x, arrow.y, 20, enemyCenterX, enemyCenterY, 25)) {
                        trippleShootEnemyRef.current.splice(eIndex, 1);
                        score.current += 15;
                        difficulty.current += Math.floor(score.current / 100);
                        
                        arrow.pierceCount++;
                        if (arrow.pierceCount >= arrow.maxPierce) {
                            arrows.current.splice(arrowIndex, 1);
                        }
                    }
                });
                
                // Check collision with bomber enemies
                bomberEnemyRef.current.forEach((enemy, eIndex) => {
                    if (!enemy.exploded) {
                        const enemyCenterX = enemy.x + enemy.width / 2;
                        const enemyCenterY = enemy.y + enemy.height / 2;
                        
                        if (circularCollision(arrow.x, arrow.y, 20, enemyCenterX, enemyCenterY, 40)) {
                            bomberEnemyRef.current.splice(eIndex, 1);
                            score.current += 20;
                            difficulty.current += Math.floor(score.current / 100);
                            
                            arrow.pierceCount++;
                            if (arrow.pierceCount >= arrow.maxPierce) {
                                arrows.current.splice(arrowIndex, 1);
                            }
                        }
                    }
                });
                
                // Check collision with teleporter enemies
                teleporterEnemyRef.current.forEach((enemy, eIndex) => {
                    if (!enemy.teleporting) {
                        const enemyCenterX = enemy.x + enemy.width / 2;
                        const enemyCenterY = enemy.y + enemy.height / 2;
                        
                        if (circularCollision(arrow.x, arrow.y, 20, enemyCenterX, enemyCenterY, 35)) {
                            teleporterEnemyRef.current.splice(eIndex, 1);
                            score.current += 25;
                            difficulty.current += Math.floor(score.current / 100);
                            
                            arrow.pierceCount++;
                            if (arrow.pierceCount >= arrow.maxPierce) {
                                arrows.current.splice(arrowIndex, 1);
                            }
                        }
                    }
                });
            });
        }

        // Spell collision detection for Mage (AOE damage)
        if (currentCharacter.combatType === 'spells') {
            spells.current.forEach((spell) => {
                if (spell.active) {
                    const spellAge = currentTime - spell.startTime;
                    const spellProgress = spellAge / spell.duration;
                    const currentSpellRadius = spell.radius * spellProgress;
                    
                    // Check collision with basic enemies
                    basicEnemyRef.current.forEach((enemy, eIndex) => {
                        const enemyHeadX = enemy.x + enemy.width / 2;
                        const enemyHeadY = enemy.y + enemy.height / 4;
                        const distance = Math.sqrt((enemyHeadX - spell.x) ** 2 + (enemyHeadY - spell.y) ** 2);
                        
                        if (distance <= currentSpellRadius) {
                            basicEnemyRef.current.splice(eIndex, 1);
                            score.current += 12; // Slightly higher score for spell kills
                            difficulty.current += Math.floor(score.current / 100);
                        }
                    });
                    
                    // Check collision with triple shoot enemies
                    trippleShootEnemyRef.current.forEach((enemy, eIndex) => {
                        const enemyCenterX = enemy.x + enemy.width / 2;
                        const enemyCenterY = enemy.y + enemy.height / 2;
                        const distance = Math.sqrt((enemyCenterX - spell.x) ** 2 + (enemyCenterY - spell.y) ** 2);
                        
                        if (distance <= currentSpellRadius) {
                            trippleShootEnemyRef.current.splice(eIndex, 1);
                            score.current += 18;
                            difficulty.current += Math.floor(score.current / 100);
                        }
                    });
                    
                    // Check collision with bomber enemies
                    bomberEnemyRef.current.forEach((enemy, eIndex) => {
                        if (!enemy.exploded) {
                            const enemyCenterX = enemy.x + enemy.width / 2;
                            const enemyCenterY = enemy.y + enemy.height / 2;
                            const distance = Math.sqrt((enemyCenterX - spell.x) ** 2 + (enemyCenterY - spell.y) ** 2);
                            
                            if (distance <= currentSpellRadius) {
                                bomberEnemyRef.current.splice(eIndex, 1);
                                score.current += 25;
                                difficulty.current += Math.floor(score.current / 100);
                            }
                        }
                    });
                    
                    // Check collision with teleporter enemies
                    teleporterEnemyRef.current.forEach((enemy, eIndex) => {
                        if (!enemy.teleporting) {
                            const enemyCenterX = enemy.x + enemy.width / 2;
                            const enemyCenterY = enemy.y + enemy.height / 2;
                            const distance = Math.sqrt((enemyCenterX - spell.x) ** 2 + (enemyCenterY - spell.y) ** 2);
                            
                            if (distance <= currentSpellRadius) {
                                teleporterEnemyRef.current.splice(eIndex, 1);
                                score.current += 30;
                                difficulty.current += Math.floor(score.current / 100);
                            }
                        }
                    });
                    
                    // Spells destroy enemy bullets in their radius
                    basicEnemyBulletsRef.current.forEach((bullet, bIndex) => {
                        const distance = Math.sqrt((bullet.x - spell.x) ** 2 + (bullet.y - spell.y) ** 2);
                        if (distance <= currentSpellRadius) {
                            basicEnemyBulletsRef.current.splice(bIndex, 1);
                        }
                    });
                    
                    teleporterEnemyBulletsRef.current.forEach((bullet, bIndex) => {
                        const distance = Math.sqrt((bullet.x - spell.x) ** 2 + (bullet.y - spell.y) ** 2);
                        if (distance <= currentSpellRadius) {
                            teleporterEnemyBulletsRef.current.splice(bIndex, 1);
                        }
                    });
                    
                    trippleShootEnemyBulletsRef.current.forEach((bullet, bIndex) => {
                        const distance = Math.sqrt((bullet.x - spell.x) ** 2 + (bullet.y - spell.y) ** 2);
                        if (distance <= currentSpellRadius) {
                            trippleShootEnemyBulletsRef.current.splice(bIndex, 1);
                        }
                    });
                }
            });
        }

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

        // Collisions between player and bomber enemies
        bomberEnemyRef.current.forEach((enemy, index) => {
            if (enemy.exploded) return; // Skip exploded bombers
            
            const enemyCenterX = enemy.x + enemy.width / 2;
            const enemyCenterY = enemy.y + enemy.height / 2;
            const playerCenterX = playerRef.current.x + playerRef.current.width / 2;
            const playerCenterY = playerRef.current.y + playerRef.current.height / 2;
            
            if (circularCollision(playerCenterX, playerCenterY, PLAYER_COLLISION_RADIUS, enemyCenterX, enemyCenterY, 40)) {
                // Only lose if not immortal
                if (!immortalityAbilityActive.current) {
                    looseRef.current = true;
                    setLoose(true);
                }
            }
        });

        // Collisions between player and teleporter enemies (only when not teleporting)
        teleporterEnemyRef.current.forEach((enemy, index) => {
            if (enemy.teleporting) return; // Can't hit while teleporting
            
            const enemyCenterX = enemy.x + enemy.width / 2;
            const enemyCenterY = enemy.y + enemy.height / 2;
            const playerCenterX = playerRef.current.x + playerRef.current.width / 2;
            const playerCenterY = playerRef.current.y + playerRef.current.height / 2;
            
            if (circularCollision(playerCenterX, playerCenterY, PLAYER_COLLISION_RADIUS, enemyCenterX, enemyCenterY, 35)) {
                // Only lose if not immortal or phase walking
                if (!immortalityAbilityActive.current && !phaseWalkActive.current) {
                    looseRef.current = true;
                    setLoose(true);
                }
            }
        });

        // Collisions between player and teleporter enemy bullets (homing bullets)
        teleporterEnemyBulletsRef.current.forEach((bullet, index) => {
            const playerCenterX = playerRef.current.x + playerRef.current.width / 2;
            const playerCenterY = playerRef.current.y + playerRef.current.height / 2;
            
            if (circularCollision(playerCenterX, playerCenterY, PLAYER_COLLISION_RADIUS, bullet.x, bullet.y, 15)) {
                teleporterEnemyBulletsRef.current.splice(index, 1);
                // Only lose if not immortal or phase walking
                if (!immortalityAbilityActive.current && !phaseWalkActive.current) {
                    looseRef.current = true;
                    setLoose(true);
                }
            }
        });

        // Collisions between player bullets and bomber enemies
        bullets.current.forEach((bullet, bIndex) => {
            bomberEnemyRef.current.forEach((enemy, eIndex) => {
                if (enemy.exploded) return; // Can't hit exploded bombers
                
                const enemyCenterX = enemy.x + enemy.width / 2;
                const enemyCenterY = enemy.y + enemy.height / 2;
                const bulletCenterX = bullet.x + 15;
                const bulletCenterY = bullet.y + 15;
                
                if (circularCollision(enemyCenterX, enemyCenterY, 40, bulletCenterX, bulletCenterY, 15)) {
                    bullets.current.splice(bIndex, 1);
                    bomberEnemyRef.current.splice(eIndex, 1);
                    score.current += 25; // Higher score for harder enemy
                    difficulty.current += Math.floor(score.current / 100);
                }
            })
        });

        // Collisions between player bullets and teleporter enemies (only when not teleporting)
        bullets.current.forEach((bullet, bIndex) => {
            teleporterEnemyRef.current.forEach((enemy, eIndex) => {
                if (enemy.teleporting) return; // Can't hit while teleporting
                
                const enemyCenterX = enemy.x + enemy.width / 2;
                const enemyCenterY = enemy.y + enemy.height / 2;
                const bulletCenterX = bullet.x + 15;
                const bulletCenterY = bullet.y + 15;
                
                if (circularCollision(enemyCenterX, enemyCenterY, 35, bulletCenterX, bulletCenterY, 15)) {
                    bullets.current.splice(bIndex, 1);
                    teleporterEnemyRef.current.splice(eIndex, 1);
                    score.current += 30; // Highest score for most challenging enemy
                    difficulty.current += Math.floor(score.current / 100);
                }
            })
        });

        // Collisions between teleporter bullets and player bullets (destroys both)
        teleporterEnemyBulletsRef.current.forEach((eBullet, ebIndex) => {
            bullets.current.forEach((bullet, bIndex) => {
                const bulletCenterX = bullet.x + 15;
                const bulletCenterY = bullet.y + 15;
                
                if (circularCollision(eBullet.x, eBullet.y, 15, bulletCenterX, bulletCenterY, 15)) {
                    // Remove both bullets on collision
                    teleporterEnemyBulletsRef.current.splice(ebIndex, 1);
                    bullets.current.splice(bIndex, 1);
                }
            })
        });

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


       

        // Draw cooldown progress bar for both combat types
        if (currentCharacter.combatType === 'bullets' && !canShoot.current) {
            const elapsed = currentTime - lastShotTime.current;
            const progress = Math.min(elapsed / reloadTimeRef.current, 1);

            const barWidth = 20;
            const barHeight = 100;
            const barX = playerCenterX - 100;
            const barY = playerCenterY - 40;

            ctx.save();

            ctx.fillStyle = "black";
            drawRoundedRect(ctx, barX, barY, barWidth, barHeight, 5);
            ctx.fill();

            ctx.clip();

            ctx.fillStyle = "orange";
            ctx.fillRect(barX, barY, barWidth, barHeight * progress);

            ctx.restore();
        } else if (currentCharacter.combatType === 'slash' && !canSlash.current) {
            const elapsed = currentTime - lastSlashTime.current;
            const progress = Math.min(elapsed / SLASH_COOLDOWN, 1);

            const barWidth = 20;
            const barHeight = 100;
            const barX = playerCenterX - 100;
            const barY = playerCenterY - 40;

            ctx.save();

            ctx.fillStyle = "black";
            drawRoundedRect(ctx, barX, barY, barWidth, barHeight, 5);
            ctx.fill();

            ctx.clip();

            ctx.fillStyle = "yellow"; // Yellow for slash cooldown
            ctx.fillRect(barX, barY, barWidth, barHeight * progress);

            ctx.restore();
        } else if (currentCharacter.combatType === 'arrows' && !canShootArrow.current) {
            // Archer arrow cooldown
            const elapsed = currentTime - lastArrowTime.current;
            const progress = Math.min(elapsed / ARROW_COOLDOWN, 1);

            const barWidth = 20;
            const barHeight = 100;
            const barX = playerCenterX - 100;
            const barY = playerCenterY - 40;

            ctx.save();

            ctx.fillStyle = "black";
            drawRoundedRect(ctx, barX, barY, barWidth, barHeight, 5);
            ctx.fill();

            ctx.clip();

            ctx.fillStyle = "green"; // Green for arrow cooldown
            ctx.fillRect(barX, barY, barWidth, barHeight * progress);

            ctx.restore();
        } else if (currentCharacter.combatType === 'spells' && !canCastSpell.current) {
            // Mage spell cooldown
            const elapsed = currentTime - lastSpellTime.current;
            const progress = Math.min(elapsed / SPELL_COOLDOWN, 1);

            const barWidth = 20;
            const barHeight = 100;
            const barX = playerCenterX - 100;
            const barY = playerCenterY - 40;

            ctx.save();

            ctx.fillStyle = "black";
            drawRoundedRect(ctx, barX, barY, barWidth, barHeight, 5);
            ctx.fill();

            ctx.clip();

            ctx.fillStyle = "purple"; // Purple for spell cooldown
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
                    case 'immortality':
                        abilityRef = immortalityAbilityRef.current;
                        isOnCooldown = immortalityAbilityOnCooldown.current;
                        cooldownStartTime = immortalityAbilityCooldownStartTime.current;
                        cooldownDuration = IMMORTALITY_COOLDOWN;
                        abilityName = 'T';
                        break;
                    case 'gravitywell':
                        abilityRef = gravityWellAbilityRef.current; // Use specific gravity well icon
                        isOnCooldown = gravityWellAbilityOnCooldown.current;
                        cooldownStartTime = gravityWellAbilityCooldownStartTime.current;
                        cooldownDuration = GRAVITY_COOLDOWN;
                        abilityName = 'R';
                        break;
                    case 'phasewalk':
                        abilityRef = phaseWalkAbilityRef.current; // Use specific phase walk icon
                        isOnCooldown = phaseWalkAbilityOnCooldown.current;
                        cooldownStartTime = phaseWalkAbilityCooldownStartTime.current;
                        cooldownDuration = PHASEWALK_COOLDOWN;
                        abilityName = 'F';
                        break;
                    case 'scoreboost':
                        abilityRef = scoreBoostAbilityRef.current; // Use specific score boost icon
                        isOnCooldown = scoreBoostAbilityOnCooldown.current;
                        cooldownStartTime = scoreBoostAbilityCooldownStartTime.current;
                        cooldownDuration = SCOREBOOST_COOLDOWN;
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