import { useEffect, useState, useRef } from "react";
import "../../responsive.css";
import LoadingScreen from "./LoadingScreen";
import { useLoading, loadingSteps } from "../hooks/useLoading";
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
import soldierAbility from "../Sprites/soldier-ability.png";
// New abilities - using existing sprites as placeholders until proper sprites are added
import freezeAbility from "../Sprites/freeze-ability.png"; // Placeholder for freeze
import lightningStormAbility from "../Sprites/lightning-ability.png"; // Placeholder for lightning storm
import poisonCloudAbility from "../Sprites/poison-ability.png"; // Placeholder for poison cloud
import shieldAbility from "../Sprites/shield-ability.png"; // Placeholder for shield
import dashAbility from "../Sprites/dash-ability.png"; // Placeholder for dash
import magnetAbility from "../Sprites/magnet-ability.png"; // Placeholder for magnet
import mirrorCloneAbility from "../Sprites/mirrorClone-ability.png"; // Placeholder for mirror clone
import berserkerModeAbility from "../Sprites/berserker-ability.png"; // Placeholder for berserker mode
import wallCreationAbility from "../Sprites/wallCreation-ability.png"; // Placeholder for wall creation
import meteorAbility from "../Sprites/meteor-ability.png"; // Placeholder for meteor
// New enemy sprites
import bomberSprite from "../Sprites/bomberSprite.png"; // Using rock sprite for bomber
import teleporterSprite from "../Sprites/goblinSprite.png"; // Using goblin sprite but different color
import rapunzelSprite from "../Sprites/rapunzelPlayerSprite.png";
// New character sprites (you can change these import paths to your actual sprite files)
import archerSprite from "../Sprites/archerPlayer.png"; // Change this to your archer sprite
import mageSprite from "../Sprites/runeMagePlayer.png"; // Change this to your mage sprite
import kingSprite from "./../Sprites/kingPlayerSprite.png"; // Temporary sprite for King - will be replaced
import soldierSprite from "./../Sprites/soldierSprite.png"; // Temporary sprite for Soldier - will be replaced
import { Link } from "react-router-dom";


export default function GameCanvas({showCollision, R_ability, F_ability, T_ability, character, addGold, addExp, exp, level, gold, reloadGameData}) {

    // Initialize game loading
    const { isLoading, progress, message, setIsLoading } = useLoading(loadingSteps.game);
    
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
        const reloadAbilityActive = useRef(false); // Track when reload ability is active
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
        const GRAVITY_DURATION = 2000;
        const GRAVITY_PULL_RADIUS = 550;
        const GRAVITY_PULL_STRENGTH = 15;
        const GRAVITY_EXPLOSION_RADIUS = 400;
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

        // Soldier Ability (spawns soldiers like King's combat)
        const SOLDIER_ABILITY_COOLDOWN = 3000; // Same as King's soldier cooldown
        const SOLDIER_ABILITY_COOLDOWN_BOOSTED = 500; // Same as King's boosted cooldown
        const soldierAbilityRef = useRef(null);
        const soldierAbilityOnCooldown = useRef(false);
        const soldierAbilityCooldownStartTime = useRef(0);
        const soldierAbilitySoldiers = useRef([]); // Separate soldier array for the ability
        const soldierAbilitySoldierBullets = useRef([]); // Separate bullet array for ability soldiers

        // Freeze ability (R)
        const FREEZE_COOLDOWN = 15000;
        const FREEZE_DURATION = 3000;
        const freezeAbilityRef = useRef(null);
        const freezeAbilityOnCooldown = useRef(false);
        const freezeAbilityCooldownStartTime = useRef(0);
        const freezeAbilityActive = useRef(false);
        const freezeAbilityStartTime = useRef(0);

        // Lightning Storm ability (R)
        const LIGHTNING_STORM_COOLDOWN = 12000;
        const LIGHTNING_STORM_DURATION = 5000;
        const LIGHTNING_STORM_STRIKES = 15; // Number of lightning strikes
        const LIGHTNING_STORM_RADIUS = 100; // Lightning strike damage radius
        const LIGHTNING_STORM_DAMAGE = 25;
        const lightningStormAbilityRef = useRef(null);
        const lightningStormAbilityOnCooldown = useRef(false);
        const lightningStormAbilityCooldownStartTime = useRef(0);
        const lightningStormAbilityActive = useRef(false);
        const lightningStormAbilityStartTime = useRef(0);
        const lightningStrikes = useRef([]);

        // Poison Cloud ability (R)
        const POISON_CLOUD_COOLDOWN = 10000;
        const POISON_CLOUD_DURATION = 8000;
        const POISON_CLOUD_RADIUS = 200;
        const POISON_CLOUD_DAMAGE_INTERVAL = 500; // Damage every 0.5 seconds
        const POISON_CLOUD_DAMAGE = 5;
        const poisonCloudAbilityRef = useRef(null);
        const poisonCloudAbilityOnCooldown = useRef(false);
        const poisonCloudAbilityCooldownStartTime = useRef(0);
        const poisonClouds = useRef([]);

        // Shield ability (F)
        const SHIELD_COOLDOWN = 20000;
        const SHIELD_DURATION = 8000;
        const SHIELD_HITS = 3; // Number of hits the shield can absorb
        const shieldAbilityRef = useRef(null);
        const shieldAbilityOnCooldown = useRef(false);
        const shieldAbilityCooldownStartTime = useRef(0);
        const shieldAbilityActive = useRef(false);
        const shieldAbilityStartTime = useRef(0);
        const shieldHitsRemaining = useRef(0);

        // Dash ability (F)
        const DASH_COOLDOWN = 5000;
        const DASH_DISTANCE = 300;
        const DASH_DAMAGE = 20;
        const DASH_SPEED = 50; // Speed of dash movement
        const dashAbilityRef = useRef(null);
        const dashAbilityOnCooldown = useRef(false);
        const dashAbilityCooldownStartTime = useRef(0);
        const dashActive = useRef(false);
        const dashStartTime = useRef(0);
        const dashStartPosition = useRef({x: 0, y: 0});
        const dashEndPosition = useRef({x: 0, y: 0});

        // Magnet ability (T)
        const MAGNET_COOLDOWN = 12000;
        const MAGNET_DURATION = 4000;
        const MAGNET_PULL_STRENGTH = 50; // Extremely strong magnet
        const magnetAbilityRef = useRef(null);
        const magnetAbilityOnCooldown = useRef(false);
        const magnetAbilityCooldownStartTime = useRef(0);
        const magnetAbilityActive = useRef(false);
        const magnetAbilityStartTime = useRef(0);

        // Mirror Clone ability (T)
        const MIRROR_CLONE_COOLDOWN = 20000;
        const MIRROR_CLONE_DURATION = 10000;
        const MIRROR_CLONE_COUNT = 2;
        const mirrorCloneAbilityRef = useRef(null);
        const mirrorCloneAbilityOnCooldown = useRef(false);
        const mirrorCloneAbilityCooldownStartTime = useRef(0);
        const mirrorCloneAbilityActive = useRef(false);
        const mirrorCloneAbilityStartTime = useRef(0);
        const mirrorClones = useRef([]);

        // Berserker Mode ability (T)
        const BERSERKER_MODE_COOLDOWN = 25000;
        const BERSERKER_MODE_DURATION = 10000;
        const BERSERKER_ATTACK_SPEED_MULTIPLIER = 0.05; // 20x faster attacks
        const BERSERKER_MOVE_SPEED_MULTIPLIER = 4.0; // 4x faster movement
        const BERSERKER_DAMAGE_MULTIPLIER = 8.0; // 8x more damage
        const berserkerModeAbilityRef = useRef(null);
        const berserkerModeAbilityOnCooldown = useRef(false);
        const berserkerModeAbilityCooldownStartTime = useRef(0);
        const berserkerModeAbilityActive = useRef(false);
        const berserkerModeAbilityStartTime = useRef(0);

        // Wall Creation ability (F)
        const WALL_CREATION_COOLDOWN = 8000;
        const WALL_CREATION_LIFETIME = 15000;
        const WALL_WIDTH = 200;
        const WALL_HEIGHT = 20;
        const wallCreationAbilityRef = useRef(null);
        const wallCreationAbilityOnCooldown = useRef(false);
        const wallCreationAbilityCooldownStartTime = useRef(0);
        const walls = useRef([]);

        // Meteor ability (R)
        const METEOR_COOLDOWN = 16000;
        const METEOR_DELAY = 2000; // 2 seconds warning before impact
        const METEOR_RADIUS = 200; // Much larger meteor damage radius
        const METEOR_DAMAGE_RADIUS = 400; // Even larger damage area
        const METEOR_DAMAGE = 150; // Much more damage
        const meteorAbilityRef = useRef(null);
        const meteorAbilityOnCooldown = useRef(false);
        const meteorAbilityCooldownStartTime = useRef(0);
        const meteors = useRef([]);
        const meteorTargets = useRef([]);

    // Ability configuration helper
    const getAbilityConfig = () => {
        return {
            R: {
                ability: R_ability,
                key: 'r',
                available: R_ability === 'reload' || R_ability === 'splash' || R_ability === 'gravitywell' || 
                          R_ability === 'freeze' || R_ability === 'lightningstorm' || R_ability === 'poisoncloud' || R_ability === 'meteor'
            },
            F: {
                ability: F_ability,
                key: 'f', 
                available: F_ability === 'flash' || F_ability === 'speed' || F_ability === 'phasewalk' || 
                          F_ability === 'shield' || F_ability === 'dash' || F_ability === 'wallcreation'
            },
            T: {
                ability: T_ability,
                key: 't',
                available: T_ability === 'teleport' || T_ability === 'immortality' || T_ability === 'scoreboost' || T_ability === 'soldierHelp' ||
                          T_ability === 'magnet' || T_ability === 'mirrorclone' || T_ability === 'berserkermode'
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
                rotationOffset: -Math.PI/2
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
            },
            king: {
                sprite: kingSprite,
                combatType: 'soldiers',
                width: 180,
                height: 180,
                rotationOffset: -Math.PI/2
            }
        };
    };

    // end abilities

    // constants
    const CANVAS_WIDTH = window.innerWidth;
    const CANVAS_HEIGHT = window.innerHeight;
    


    // TIER SYSTEM - enemies unlock based on score thresholds
    const TIER_1_THRESHOLD = 0;     // Basic enemies from start
    const TIER_2_THRESHOLD = 150;   // Triple shoot and bomber unlock at score 150
    const TIER_3_THRESHOLD = 300;   // Teleporter enemies unlock at score 300

    // TIER 1 ENEMIES - Available from start (Score >= 0)
    const SPAWN_BASIC_ENEMY_TIME = 3000;      // Slower spawn rate for balance
    const SPAWN_BASIC_ENEMY_TIME_MIN = 1500;  // Increased minimum for better gameplay

    // TIER 2 ENEMIES - Unlock at Score >= 150
    const SPAWN_TRIPPLESHOOT_ENEMY_TIME = 12000;  // Reduced frequency for balance
    const SPAWN_TRIPPLESHOOT_ENEMY_TIME_MIN = 6000;
    const TRIPPLESHOOT_ENEMY_BULLET_ANGLE = 0.6 // in radians, 0.2 = 11.46 degrees

    // Bomber enemy constants (TIER 2)
    const SPAWN_BOMBER_ENEMY_TIME = 18000; // Slower spawn for balance
    const SPAWN_BOMBER_ENEMY_TIME_MIN = 10000;
    const BOMBER_ENEMY_SPEED = 1.8; // Slightly slower for fairness
    const BOMBER_ENEMY_SPEED_SLOW = 0.4;
    const BOMBER_EXPLOSION_RADIUS = 180; // Slightly smaller radius
    const BOMBER_FUSE_TIME = 3500; // More time to react
    const BOMBER_WARNING_TIME = 1500; // Longer warning

    // TIER 3 ENEMIES - Unlock at Score >= 300
    const SPAWN_TELEPORTER_ENEMY_TIME = 15000; // Less frequent spawn
    const SPAWN_TELEPORTER_ENEMY_TIME_MIN = 8000;
    const TELEPORTER_ENEMY_SPEED = 2.5; // Balanced speed
    const TELEPORTER_ENEMY_SPEED_SLOW = 0.8;
    const TELEPORTER_BULLET_SPEED = 12; // Reduced bullet speed
    const TELEPORTER_BULLET_SPEED_SLOW = 1;
    const TELEPORTER_TELEPORT_INTERVAL = 4000; // Teleports every 4 seconds
    const TELEPORTER_HOMING_STRENGTH = 0.1; // How strongly bullets home

    const PLAYER_SPEED = 4;
    const PLAYER_SPEED_SLOW = 1;
    const PLAYER_BULLET_SPEED = 25;
    const PLAYER_BULLET_SPEED_SLOW = 1;
    const PLAYER_COLLISION_RADIUS = 40; // Collision radius for player (180x180 sprite)
    
    const BASIC_ENEMY_SPEED = 3;
    const BASIC_ENEMY_BULLET_SPEED = 15;
    const BASIC_ENEMY_SPEED_SLOW = 1;
    const BASIC_ENEMY_BULLET_SPEED_SLOW = 1.5;

    const GOBLIN_BULLET_SIZE = 125; // Size of goblin bullet sprite (width and height) - zmenšeno z 120
    const GOBLIN_BULLET_RADIUS = 20; // Collision radius for goblin bullets - zmenšeno z 25

    const TRIPPLESHOOT_ENEMY_SPEED = 2.5;
    const TRIPPLESHOOT_ENEMY_BULLET_SPEED = 15;
    const TRIPPLESHOOT_ENEMY_SPEED_SLOW = 1;
    const TRIPPLESHOOT_ENEMY_BULLET_SPEED_SLOW = 1.5;

    // Responsive performance system for consistent gameplay across devices
    // Base reference: 60 FPS target for all devices
    const TARGET_FPS = 60;
    const frameTimeHistory = useRef([]);
    const lastFrameTime = useRef(performance.now());
    
    // Helper function for balanced difficulty progression
    const updateDifficulty = () => {
        // More gradual difficulty scaling based on current tier
        const currentTierBonus = score.current >= TIER_3_THRESHOLD ? 3 : (score.current >= TIER_2_THRESHOLD ? 2 : 1);
        const scalingFactor = 200 / currentTierBonus; // Higher tier = faster difficulty increase
        difficulty.current = 1 + Math.floor(score.current / scalingFactor);
    };
    
    // Calculate current FPS and adjust game speed accordingly
    const getResponsiveSpeedMultiplier = () => {
        const currentTime = performance.now();
        const deltaTime = currentTime - lastFrameTime.current;
        lastFrameTime.current = currentTime;
        
        // Track frame times for averaging
        frameTimeHistory.current.push(deltaTime);
        if (frameTimeHistory.current.length > 30) { // Keep last 30 frames
            frameTimeHistory.current.shift();
        }
        
        // Calculate average FPS
        const avgDeltaTime = frameTimeHistory.current.reduce((a, b) => a + b, 0) / frameTimeHistory.current.length;
        const currentFPS = 1000 / avgDeltaTime;
        
        // Calculate speed multiplier to maintain consistent gameplay
        // If FPS is lower, speed up game elements to compensate
        const fpsRatio = TARGET_FPS / currentFPS;
        
        // Clamp between 0.5x and 2x for reasonable gameplay
        // This ensures game doesn't become unplayable on very slow or very fast devices
        return Math.max(0.5, Math.min(2.0, fpsRatio));
    };





    // canvas
    const canvasRef = useRef(null);
    const keys = useRef({});
    const mousemove = useRef({x:0, y:0});
    const mouseclick = useRef(false);
    

    //game
    const gameImageBackgroundRef = useRef(null);    

    // Kill effects system
    const particles = useRef([]);
    const floatingTexts = useRef([]);

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

    // Tier system tracking
    const tier2Unlocked = useRef(false);
    const tier3Unlocked = useRef(false);
    const tierNotifications = useRef([]);

    // Slash combat system constants and refs
    const SLASH_RANGE = 300; // Range of slash attack
    const SLASH_DURATION = 300; // Duration of slash animation in ms
    const SLASH_COOLDOWN = 600; // Cooldown between slashes
    const SLASH_COOLDOWN_BOOSTED = 100; // Reduced cooldown with reload ability
    const SLASH_ANGLE_SPREAD = Math.PI / 3; // 60 degree slash arc
    
    // Archer combat system constants
    const ARROW_SPEED = 35; // Faster than bullets
    const ARROW_COOLDOWN = 400; // Faster than bullets but slower than slash
    const ARROW_COOLDOWN_BOOSTED = 100; // Reduced cooldown with reload ability
    const ARROW_PIERCING = 3; // Can pierce through 3 enemies
    
    // Mage combat system constants
    const SPELL_COOLDOWN = 1700; // Slower cast time
    const SPELL_COOLDOWN_BOOSTED = 200; // Reduced cooldown with reload ability (8.5x faster)
    const SPELL_DAMAGE_RADIUS = 120; // AOE damage radius
    const SPELL_DURATION = 800; // How long spell effect lasts
    
    // King combat system constants
    const KING_SOLDIER_COOLDOWN = 3000; // 3 seconds cooldown to spawn soldier
    const KING_SOLDIER_COOLDOWN_BOOSTED = 500; // Reduced cooldown with reload ability (6x faster)
    const KING_SOLDIER_LIFETIME = 5000; // 5 seconds soldier lifetime
    const KING_SOLDIER_SHOOT_COOLDOWN = 1000; // 1 second between soldier shots
    const KING_SOLDIER_BULLET_SPEED = 20; // Soldier bullet speed
    const KING_SOLDIER_RANGE = 300; // How far soldier can detect enemies
    
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
    
    // King system refs
    const soldiers = useRef([]);
    const soldierBullets = useRef([]);
    const canSpawnSoldier = useRef(true);
    const lastSoldierSpawnTime = useRef(0);
    const kingImageRef = useRef(null);
    const soldierImageRef = useRef(null);

    // Use ref for loose state so gameLoop can see updates immediately
    const looseRef = useRef(false);
    const rewardsGivenRef = useRef(false); // Track if rewards have been given
    const [loose, setLoose] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key.toLowerCase(); // Normalize key to lowercase
            const currentTime = performance.now();
            const abilityConfig = getAbilityConfig();

            // R Ability handler (reload or splash)
            if (key === "r" && abilityConfig.R.available) {
                if (R_ability === 'reload' && !abilityOnCooldown.current) {
                    console.log("Reload ability activated!");
                    reloadTimeRef.current = RELOADTIME_ABILITY_BOOST;
                    reloadAbilityActive.current = true;
                    abilityOnCooldown.current = true;
                    abilityCooldownStartTime.current = currentTime;

                    // Reset ability timestamps to current time to sync with boosted cooldowns
                    // Always reset timestamps when abilities are on cooldown
                    if (!canSlash.current) {
                        lastSlashTime.current = currentTime;
                        console.log("Reset slash time");
                    }
                    if (!canShootArrow.current) {
                        lastArrowTime.current = currentTime;
                        console.log("Reset arrow time");
                    }
                    if (!canCastSpell.current) {
                        lastSpellTime.current = currentTime;
                        console.log("Reset spell time");
                    }
                    if (!canSpawnSoldier.current) {
                        lastSoldierSpawnTime.current = currentTime;
                        console.log("Reset King soldier time");
                    }
                    if (soldierAbilityOnCooldown.current) {
                        soldierAbilityCooldownStartTime.current = currentTime;
                        console.log("Reset soldier ability time");
                    }

                    setTimeout(() => {
                        let finalReloadTime = RELOADTIME;
                        if (berserkerModeAbilityActive.current) {
                            finalReloadTime *= BERSERKER_ATTACK_SPEED_MULTIPLIER;
                        }
                        reloadTimeRef.current = finalReloadTime;
                        reloadAbilityActive.current = false;
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
                } else if (R_ability === 'freeze' && !freezeAbilityOnCooldown.current) {
                    // Freeze ability - freeze all enemies for FREEZE_DURATION
                    freezeAbilityActive.current = true;
                    freezeAbilityOnCooldown.current = true;
                    freezeAbilityCooldownStartTime.current = currentTime;
                    
                    // Deactivate freeze after duration
                    setTimeout(() => {
                        freezeAbilityActive.current = false;
                    }, FREEZE_DURATION);
                    
                    // Reset cooldown
                    setTimeout(() => {
                        freezeAbilityOnCooldown.current = false;
                    }, FREEZE_COOLDOWN);
                } else if (R_ability === 'lightningstorm' && !lightningStormAbilityOnCooldown.current) {
                    // Lightning Storm ability - spawn lightning strikes at random positions
                    lightningStormAbilityActive.current = true;
                    lightningStormAbilityOnCooldown.current = true;
                    lightningStormAbilityCooldownStartTime.current = currentTime;
                    
                    let strikeCount = 0;
                    const strikesInterval = setInterval(() => {
                        if (strikeCount >= LIGHTNING_STORM_STRIKES) {
                            clearInterval(strikesInterval);
                            lightningStormAbilityActive.current = false;
                            return;
                        }
                        
                        // Create lightning strike at random position
                        const strikeX = Math.random() * CANVAS_WIDTH;
                        const strikeY = Math.random() * CANVAS_HEIGHT;
                        
                        lightningStrikes.current.push({
                            x: strikeX,
                            y: strikeY,
                            timestamp: performance.now(),
                            radius: LIGHTNING_STORM_RADIUS
                        });
                        
                        strikeCount++;
                    }, LIGHTNING_STORM_DURATION / LIGHTNING_STORM_STRIKES);
                    
                    // Reset cooldown
                    setTimeout(() => {
                        lightningStormAbilityOnCooldown.current = false;
                    }, LIGHTNING_STORM_COOLDOWN);
                } else if (R_ability === 'poisoncloud' && !poisonCloudAbilityOnCooldown.current) {
                    // Poison Cloud ability - create poison cloud at mouse position
                    const poisonX = mousemove.current.x;
                    const poisonY = mousemove.current.y;
                    
                    poisonClouds.current.push({
                        x: poisonX,
                        y: poisonY,
                        timestamp: performance.now(),
                        radius: POISON_CLOUD_RADIUS
                    });
                    
                    poisonCloudAbilityOnCooldown.current = true;
                    poisonCloudAbilityCooldownStartTime.current = currentTime;
                    
                    // Reset cooldown
                    setTimeout(() => {
                        poisonCloudAbilityOnCooldown.current = false;
                    }, POISON_CLOUD_COOLDOWN);
                } else if (R_ability === 'meteor' && !meteorAbilityOnCooldown.current) {
                    // Meteor ability - delay then spawn meteor at mouse position
                    const meteorTargetX = mousemove.current.x;
                    const meteorTargetY = mousemove.current.y;
                    
                    meteorAbilityOnCooldown.current = true;
                    meteorAbilityCooldownStartTime.current = currentTime;
                    
                    // Show meteor target indicator
                    meteorTargets.current.push({
                        x: meteorTargetX,
                        y: meteorTargetY,
                        timestamp: performance.now()
                    });
                    
                    // Spawn meteor after delay
                    setTimeout(() => {
                        meteors.current.push({
                            x: meteorTargetX,
                            y: meteorTargetY,
                            timestamp: performance.now(),
                            radius: METEOR_RADIUS
                        });
                        
                        // Remove target indicator
                        meteorTargets.current = meteorTargets.current.filter(target => 
                            target.x !== meteorTargetX || target.y !== meteorTargetY
                        );
                    }, METEOR_DELAY);
                    
                    // Reset cooldown
                    setTimeout(() => {
                        meteorAbilityOnCooldown.current = false;
                    }, METEOR_COOLDOWN);
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
                } else if (F_ability === 'shield' && !shieldAbilityOnCooldown.current) {
                    // Shield ability - activate protective shield
                    shieldAbilityActive.current = true;
                    shieldAbilityOnCooldown.current = true;
                    shieldAbilityCooldownStartTime.current = currentTime;
                    shieldHitsRemaining.current = SHIELD_HITS;
                    
                    // Deactivate shield after duration or when hits depleted
                    setTimeout(() => {
                        shieldAbilityActive.current = false;
                        shieldHitsRemaining.current = 0;
                    }, SHIELD_DURATION);
                    
                    // Reset cooldown
                    setTimeout(() => {
                        shieldAbilityOnCooldown.current = false;
                    }, SHIELD_COOLDOWN);
                } else if (F_ability === 'dash' && !dashAbilityOnCooldown.current) {
                    // Dash ability - quick movement towards mouse
                    const playerCenterX = playerRef.current.x + playerRef.current.width / 2;
                    const playerCenterY = playerRef.current.y + playerRef.current.height / 2;
                    
                    const dx = mousemove.current.x - playerCenterX;
                    const dy = mousemove.current.y - playerCenterY;
                    const length = Math.sqrt(dx * dx + dy * dy);
                    
                    if (length > 0) {
                        const normalizedDx = dx / length;
                        const normalizedDy = dy / length;
                        
                        const dashDistance = Math.min(length, DASH_DISTANCE);
                        
                        // Kill enemies along the dash path
                        const numSteps = 10; // Check collision in multiple steps along the dash
                        for (let step = 0; step <= numSteps; step++) {
                            const stepProgress = step / numSteps;
                            const checkX = playerCenterX + normalizedDx * dashDistance * stepProgress;
                            const checkY = playerCenterY + normalizedDy * dashDistance * stepProgress;
                            
                            // Check collision with basic enemies
                            basicEnemyRef.current = basicEnemyRef.current.filter((enemy) => {
                                const enemyCenterX = enemy.x + enemy.width / 2;
                                const enemyCenterY = enemy.y + enemy.height / 2;
                                const distance = Math.sqrt((checkX - enemyCenterX) ** 2 + (checkY - enemyCenterY) ** 2);
                                if (distance < 50) {
                                    score.current += 10;
                                    return false; // Kill the enemy
                                }
                                return true;
                            });
                            
                            // Check collision with triple shoot enemies
                            trippleShootEnemyRef.current = trippleShootEnemyRef.current.filter((enemy) => {
                                const enemyCenterX = enemy.x + enemy.width / 2;
                                const enemyCenterY = enemy.y + enemy.height / 2;
                                const distance = Math.sqrt((checkX - enemyCenterX) ** 2 + (checkY - enemyCenterY) ** 2);
                                if (distance < 50) {
                                    score.current += 30;
                                    return false; // Kill the enemy
                                }
                                return true;
                            });
                            
                            // Check collision with teleporter enemies
                            teleporterEnemyRef.current = teleporterEnemyRef.current.filter((enemy) => {
                                const enemyCenterX = enemy.x + enemy.width / 2;
                                const enemyCenterY = enemy.y + enemy.height / 2;
                                const distance = Math.sqrt((checkX - enemyCenterX) ** 2 + (checkY - enemyCenterY) ** 2);
                                if (distance < 50) {
                                    score.current += 35;
                                    return false; // Kill the enemy
                                }
                                return true;
                            });
                            
                            // Check collision with bomber enemies
                            bomberEnemyRef.current = bomberEnemyRef.current.filter((enemy) => {
                                const enemyCenterX = enemy.x + enemy.width / 2;
                                const enemyCenterY = enemy.y + enemy.height / 2;
                                const distance = Math.sqrt((checkX - enemyCenterX) ** 2 + (checkY - enemyCenterY) ** 2);
                                if (distance < 50) {
                                    score.current += 25;
                                    return false; // Kill the enemy
                                }
                                return true;
                            });
                        }
                        
                        const newX = playerRef.current.x + normalizedDx * dashDistance;
                        const newY = playerRef.current.y + normalizedDy * dashDistance;
                        
                        // Clamp to canvas bounds
                        playerRef.current.x = Math.max(0, Math.min(window.innerWidth - playerRef.current.width, newX));
                        playerRef.current.y = Math.max(0, Math.min(window.innerHeight - playerRef.current.height, newY));
                    }
                    
                    dashAbilityOnCooldown.current = true;
                    dashAbilityCooldownStartTime.current = currentTime;
                    
                    // Reset cooldown
                    setTimeout(() => {
                        dashAbilityOnCooldown.current = false;
                    }, DASH_COOLDOWN);
                } else if (F_ability === 'wallcreation' && !wallCreationAbilityOnCooldown.current) {
                    // Wall Creation ability - create large wall at mouse position
                    const wallX = mousemove.current.x;
                    const wallY = mousemove.current.y;
                    
                    walls.current.push({
                        x: wallX - 100, // Center the large wall
                        y: wallY - 25,
                        width: 200, // Large rectangle
                        height: 50,
                        timestamp: performance.now()
                    });
                    
                    wallCreationAbilityOnCooldown.current = true;
                    wallCreationAbilityCooldownStartTime.current = currentTime;
                    
                    // Reset cooldown
                    setTimeout(() => {
                        wallCreationAbilityOnCooldown.current = false;
                    }, WALL_CREATION_COOLDOWN);
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
            // Don't let frozen enemies shoot
            if (freezeAbilityActive.current) {
                return;
            }
            
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
            // Don't let frozen enemies shoot
            if (freezeAbilityActive.current) {
                return;
            }
            
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
            // Don't let frozen enemies shoot
            if (freezeAbilityActive.current) {
                return;
            }
            
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

                // Capture cooldown value to avoid race conditions
                const wizardCooldownToUse = reloadAbilityActive.current ? RELOADTIME_ABILITY_BOOST : reloadTimeRef.current;

                setTimeout(() => {
                    canShoot.current = true;
                }, wizardCooldownToUse);
            } else if (currentCharacter.combatType === 'slash' && canSlash.current) {
                // Rapunzel slash combat
                const playerCenterX = playerRef.current.x + playerRef.current.width / 2;
                const playerCenterY = playerRef.current.y + playerRef.current.height / 2;
                
                // Debug log for Rapunzel's ability
                console.log("Rapunzel slashing, reload active:", reloadAbilityActive.current);
                
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
                
                // Capture cooldown value to avoid race conditions
                const slashCooldownToUse = reloadAbilityActive.current ? SLASH_COOLDOWN_BOOSTED : SLASH_COOLDOWN;
                console.log("Rapunzel cooldown will be:", slashCooldownToUse);
                
                setTimeout(() => {
                    canSlash.current = true;
                    console.log("Rapunzel can slash again");
                }, slashCooldownToUse);
            } else if (currentCharacter.combatType === 'arrows' && canShootArrow.current) {
                // Archer arrow combat
                const playerCenterX = playerRef.current.x + playerRef.current.width / 2;
                const playerCenterY = playerRef.current.y + playerRef.current.height / 2;
                
                // Debug log for Archer's ability
                console.log("Archer shooting arrow, reload active:", reloadAbilityActive.current);
                
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
                
                // Capture cooldown value to avoid race conditions
                const arrowCooldownToUse = reloadAbilityActive.current ? ARROW_COOLDOWN_BOOSTED : ARROW_COOLDOWN;
                console.log("Archer cooldown will be:", arrowCooldownToUse);
                
                setTimeout(() => {
                    canShootArrow.current = true;
                    console.log("Archer can shoot arrow again");
                }, arrowCooldownToUse);
            } else if (currentCharacter.combatType === 'spells' && canCastSpell.current) {
                // Mage spell combat
                const currentTime = performance.now();
                
                // Debug log for Mage's ability
                console.log("Mage casting spell, reload active:", reloadAbilityActive.current);
                
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
                
                // Capture cooldown value to avoid race conditions
                const spellCooldownToUse = reloadAbilityActive.current ? SPELL_COOLDOWN_BOOSTED : SPELL_COOLDOWN;
                console.log("Mage cooldown will be:", spellCooldownToUse);
                
                setTimeout(() => {
                    canCastSpell.current = true;
                    console.log("Mage can cast spell again");
                }, spellCooldownToUse);
            } else if (currentCharacter.combatType === 'soldiers' && canSpawnSoldier.current) {
                // King soldier spawning combat (simplified to match other characters)
                const currentTime = performance.now();
                
                // Debug log for King's ability
                console.log("King spawning soldier, reload active:", reloadAbilityActive.current);
                
                // Spawn soldier at clicked position
                soldiers.current.push({
                    x: mousemove.current.x - 15, // Center the soldier
                    y: mousemove.current.y - 15,
                    width: 120,
                    height: 120,
                    spawnTime: Date.now(), // Keep Date.now() for soldier lifetime
                    lastShootTime: 0
                });
                
                lastSoldierSpawnTime.current = currentTime;
                canSpawnSoldier.current = false;
                
                // Capture cooldown value at spawn time to avoid race conditions
                const cooldownToUse = reloadAbilityActive.current ? KING_SOLDIER_COOLDOWN_BOOSTED : KING_SOLDIER_COOLDOWN;
                console.log("King cooldown will be:", cooldownToUse);
                
                // Allow spawning again after cooldown (same logic as other characters)
                setTimeout(() => {
                    canSpawnSoldier.current = true;
                    console.log("King can spawn soldier again");
                }, cooldownToUse);
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
            if (!canvasRef.current) return;
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

    // load soldier ability image
    useEffect(() => {
        const soldierAbilityImage = new Image();
        soldierAbilityImage.src = soldierAbility; // Use the imported soldier ability sprite
        soldierAbilityImage.onload = () => {
            soldierAbilityRef.current = soldierAbilityImage;
        };
        soldierAbilityImage.onerror = () => {
            console.error('Failed to load soldier ability sprite');
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

    // Load King sprite
    useEffect(() => {
        const kingImage = new Image();
        kingImage.src = kingSprite; // Use the imported sprite
        kingImage.onload = () => {
            kingImageRef.current = kingImage;
        };
        kingImage.onerror = () => {
            console.error('Failed to load King sprite');
        };
    }, []);

    // Load Soldier sprite
    useEffect(() => {
        const soldierImage = new Image();
        soldierImage.src = soldierSprite; // Use the imported sprite
        soldierImage.onload = () => {
            soldierImageRef.current = soldierImage;
        };
        soldierImage.onerror = () => {
            console.error('Failed to load Soldier sprite');
        };
    }, []);

    // Load new ability images
    useEffect(() => {
        const freezeImage = new Image();
        freezeImage.src = freezeAbility;
        freezeImage.onload = () => {
            freezeAbilityRef.current = freezeImage;
        };
        freezeImage.onerror = () => {
            console.error('Failed to load freeze ability sprite');
        };
    }, []);

    useEffect(() => {
        const lightningImage = new Image();
        lightningImage.src = lightningStormAbility;
        lightningImage.onload = () => {
            lightningStormAbilityRef.current = lightningImage;
        };
        lightningImage.onerror = () => {
            console.error('Failed to load lightning storm ability sprite');
        };
    }, []);

    useEffect(() => {
        const poisonImage = new Image();
        poisonImage.src = poisonCloudAbility;
        poisonImage.onload = () => {
            poisonCloudAbilityRef.current = poisonImage;
        };
        poisonImage.onerror = () => {
            console.error('Failed to load poison cloud ability sprite');
        };
    }, []);

    useEffect(() => {
        const meteorImage = new Image();
        meteorImage.src = meteorAbility;
        meteorImage.onload = () => {
            meteorAbilityRef.current = meteorImage;
        };
        meteorImage.onerror = () => {
            console.error('Failed to load meteor ability sprite');
        };
    }, []);

    useEffect(() => {
        const shieldImage = new Image();
        shieldImage.src = shieldAbility;
        shieldImage.onload = () => {
            shieldAbilityRef.current = shieldImage;
        };
        shieldImage.onerror = () => {
            console.error('Failed to load shield ability sprite');
        };
    }, []);

    useEffect(() => {
        const dashImage = new Image();
        dashImage.src = dashAbility;
        dashImage.onload = () => {
            dashAbilityRef.current = dashImage;
        };
        dashImage.onerror = () => {
            console.error('Failed to load dash ability sprite');
        };
    }, []);

    useEffect(() => {
        const wallImage = new Image();
        wallImage.src = wallCreationAbility;
        wallImage.onload = () => {
            wallCreationAbilityRef.current = wallImage;
        };
        wallImage.onerror = () => {
            console.error('Failed to load wall creation ability sprite');
        };
    }, []);

    useEffect(() => {
        const magnetImage = new Image();
        magnetImage.src = magnetAbility;
        magnetImage.onload = () => {
            magnetAbilityRef.current = magnetImage;
        };
        magnetImage.onerror = () => {
            console.error('Failed to load magnet ability sprite');
        };
    }, []);

    useEffect(() => {
        const mirrorImage = new Image();
        mirrorImage.src = mirrorCloneAbility;
        mirrorImage.onload = () => {
            mirrorCloneAbilityRef.current = mirrorImage;
        };
        mirrorImage.onerror = () => {
            console.error('Failed to load mirror clone ability sprite');
        };
    }, []);

    useEffect(() => {
        const berserkerImage = new Image();
        berserkerImage.src = berserkerModeAbility;
        berserkerImage.onload = () => {
            berserkerModeAbilityRef.current = berserkerImage;
        };
        berserkerImage.onerror = () => {
            console.error('Failed to load berserker mode ability sprite');
        };
    }, []);

    // canvas
    useEffect(() => {
        // Don't start game until loading is complete
        if (isLoading) return;
        
        // Reset game state for new game
        rewardsGivenRef.current = false;
        
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext("2d");

    let animationFrameId;

    // Function to setup responsive canvas
    const setupCanvas = () => {
        if (!canvas) return;
        
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


    // Functions for kill effects
    const createKillEffect = (x, y, scoreValue) => {
        // Create particles
        const particleCount = Math.min(15 + scoreValue, 25); // More particles for higher scores
        for (let i = 0; i < particleCount; i++) {
            particles.current.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8 - 2,
                life: 1.0,
                decay: 0.02,
                size: Math.random() * 4 + 2,
                color: scoreValue >= 25 ? [255, 215, 0] : scoreValue >= 15 ? [255, 100, 100] : [255, 255, 255]
            });
        }

        // Create floating score text
        floatingTexts.current.push({
            x: x,
            y: y,
            text: `+${scoreValue}`,
            life: 1.0,
            decay: 0.015,
            vy: -2,
            color: scoreValue >= 25 ? '#FFD700' : scoreValue >= 15 ? '#FF6464' : '#FFFFFF',
            fontSize: Math.min(20 + scoreValue * 0.5, 35)
        });
    };

    const updateAndDrawEffects = (ctx) => {
        // Update and draw particles
        particles.current = particles.current.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1; // gravity
            particle.life -= particle.decay;
            
            if (particle.life > 0) {
                ctx.save();
                ctx.globalAlpha = particle.life;
                ctx.fillStyle = `rgb(${particle.color[0]}, ${particle.color[1]}, ${particle.color[2]})`;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                return true;
            }
            return false;
        });

        // Update and draw floating texts
        floatingTexts.current = floatingTexts.current.filter(text => {
            text.y += text.vy;
            text.life -= text.decay;
            
            if (text.life > 0) {
                ctx.save();
                ctx.globalAlpha = text.life;
                ctx.fillStyle = text.color;
                ctx.font = `bold ${text.fontSize}px 'MedievalSharp', cursive`;
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.lineWidth = 3;
                ctx.textAlign = 'center';
                ctx.strokeText(text.text, text.x, text.y);
                ctx.fillText(text.text, text.x, text.y);
                ctx.restore();
                return true;
            }
            return false;
        });
    };

    const gameLoop = () => {
        if (!canvas || !ctx) return;
        
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
            case 'king':
                currentPlayerImage = kingImageRef.current;
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

        // Draw new abilities visual effects
        
        // Lightning strikes
        lightningStrikes.current.forEach(strike => {
            const strikeAge = currentTime - strike.timestamp;
            const alpha = 1 - (strikeAge / 500); // Fade out over 0.5 seconds
            
            ctx.save();
            ctx.fillStyle = `rgba(255, 255, 100, ${alpha})`;
            ctx.shadowColor = 'yellow';
            ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.arc(strike.x, strike.y, strike.radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.restore();
        });

        // Poison clouds
        poisonClouds.current.forEach(cloud => {
            const cloudAge = currentTime - cloud.timestamp;
            const alpha = Math.max(0, 1 - (cloudAge / POISON_CLOUD_DURATION));
            
            ctx.save();
            ctx.fillStyle = `rgba(0, 255, 0, ${alpha * 0.3})`;
            ctx.strokeStyle = `rgba(0, 150, 0, ${alpha})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cloud.x, cloud.y, cloud.radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        });

        // Meteors
        meteors.current.forEach(meteor => {
            const meteorAge = currentTime - meteor.timestamp;
            const alpha = Math.max(0, 1 - (meteorAge / 2000)); // Longer lasting effect
            
            ctx.save();
            
            // Massive explosion effect
            const explosionRadius = meteor.radius * (1 + (meteorAge / 1000) * 2);
            
            // Outer explosion ring (orange/red)
            const explosionGradient = ctx.createRadialGradient(meteor.x, meteor.y, 0, meteor.x, meteor.y, explosionRadius);
            explosionGradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.9})`);
            explosionGradient.addColorStop(0.3, `rgba(255, 150, 0, ${alpha * 0.7})`);
            explosionGradient.addColorStop(0.6, `rgba(255, 69, 0, ${alpha * 0.5})`);
            explosionGradient.addColorStop(1, `rgba(255, 0, 0, ${alpha * 0.2})`);
            
            ctx.fillStyle = explosionGradient;
            ctx.beginPath();
            ctx.arc(meteor.x, meteor.y, explosionRadius, 0, 2 * Math.PI);
            ctx.fill();
            
            // Inner white-hot core
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
            ctx.shadowColor = 'white';
            ctx.shadowBlur = 50;
            ctx.beginPath();
            ctx.arc(meteor.x, meteor.y, meteor.radius * 0.3, 0, 2 * Math.PI);
            ctx.fill();
            
            // Meteor particles flying outward
            for (let i = 0; i < 16; i++) {
                const angle = (i / 16) * Math.PI * 2;
                const distance = meteorAge * 0.3 + Math.sin(meteorAge * 0.01 + i) * 20;
                const particleX = meteor.x + Math.cos(angle) * distance;
                const particleY = meteor.y + Math.sin(angle) * distance;
                
                ctx.fillStyle = `rgba(255, ${100 + Math.sin(meteorAge * 0.01 + i) * 50}, 0, ${alpha * 0.6})`;
                ctx.beginPath();
                ctx.arc(particleX, particleY, 8, 0, 2 * Math.PI);
                ctx.fill();
            }
            
            ctx.restore();
        });

        // Meteor targets (warning indicators)
        meteorTargets.current.forEach(target => {
            const targetAge = currentTime - target.timestamp;
            const warningIntensity = (targetAge / METEOR_DELAY); // 0 to 1
            const alpha = Math.sin((targetAge / METEOR_DELAY) * Math.PI * 8) * 0.5 + 0.5; // Fast blinking
            
            ctx.save();
            
            // Outer warning circle (gets more intense over time)
            ctx.strokeStyle = `rgba(255, ${255 * (1 - warningIntensity)}, 0, ${alpha})`;
            ctx.lineWidth = 4 + warningIntensity * 6;
            ctx.beginPath();
            ctx.arc(target.x, target.y, METEOR_DAMAGE_RADIUS, 0, 2 * Math.PI);
            ctx.stroke();
            
            // Inner danger circle
            ctx.strokeStyle = `rgba(255, 0, 0, ${alpha * 0.8})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(target.x, target.y, METEOR_RADIUS, 0, 2 * Math.PI);
            ctx.stroke();
            
            // Center crosshair
            ctx.strokeStyle = `rgba(255, 0, 0, ${alpha})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(target.x - 20, target.y);
            ctx.lineTo(target.x + 20, target.y);
            ctx.moveTo(target.x, target.y - 20);
            ctx.lineTo(target.x, target.y + 20);
            ctx.stroke();
            
            // Warning text
            if (warningIntensity > 0.5) {
                ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
                ctx.font = "bold 20px Arial";
                ctx.textAlign = "center";
                ctx.fillText("INCOMING METEOR!", target.x, target.y - 80);
            }
            
            ctx.restore();
        });

        // Walls
        walls.current.forEach(wall => {
            const wallAge = currentTime - wall.timestamp;
            const alpha = Math.max(0, 1 - (wallAge / WALL_CREATION_LIFETIME));
            
            ctx.save();
            
            // Shadow effect
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 4;
            ctx.shadowOffsetY = 4;
            
            // Main wall body - stone-like appearance
            ctx.fillStyle = `rgba(120, 120, 120, ${alpha})`;
            ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
            
            // Top highlight
            ctx.fillStyle = `rgba(160, 160, 160, ${alpha})`;
            ctx.fillRect(wall.x, wall.y, wall.width, 8);
            
            // Side highlight
            ctx.fillStyle = `rgba(140, 140, 140, ${alpha})`;
            ctx.fillRect(wall.x, wall.y, 8, wall.height);
            
            // Border
            ctx.strokeStyle = `rgba(80, 80, 80, ${alpha})`;
            ctx.lineWidth = 3;
            ctx.strokeRect(wall.x, wall.y, wall.width, wall.height);
            
            // Stone texture lines
            ctx.strokeStyle = `rgba(100, 100, 100, ${alpha * 0.6})`;
            ctx.lineWidth = 1;
            
            // Horizontal lines
            for (let i = 1; i < 3; i++) {
                const y = wall.y + (wall.height / 3) * i;
                ctx.beginPath();
                ctx.moveTo(wall.x + 5, y);
                ctx.lineTo(wall.x + wall.width - 5, y);
                ctx.stroke();
            }
            
            // Vertical lines
            for (let i = 1; i < Math.floor(wall.width / 40); i++) {
                const x = wall.x + (wall.width / Math.floor(wall.width / 40)) * i;
                ctx.beginPath();
                ctx.moveTo(x, wall.y + 5);
                ctx.lineTo(x, wall.y + wall.height - 5);
                ctx.stroke();
            }
            
            ctx.restore();
        });

        // Mirror clones
        mirrorClones.current.forEach(clone => {
            const cloneAge = currentTime - clone.timestamp;
            const alpha = Math.max(0, 1 - (cloneAge / MIRROR_CLONE_DURATION));
            
            ctx.save();
            ctx.globalAlpha = alpha * 0.7; // Semi-transparent
            if (playerImageRef.current) {
                ctx.drawImage(
                    playerImageRef.current,
                    clone.x,
                    clone.y,
                    clone.width,
                    clone.height
                );
            } else {
                ctx.fillStyle = `rgba(0, 0, 255, ${alpha})`;
                ctx.fillRect(clone.x, clone.y, clone.width, clone.height);
            }
            ctx.restore();
        });

        // Shield visual effect
        if (shieldAbilityActive.current) {
            ctx.save();
            const shieldAlpha = 0.4;
            ctx.strokeStyle = `rgba(0, 150, 255, ${shieldAlpha})`;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(playerCenterX, playerCenterY, 80, 0, 2 * Math.PI);
            ctx.stroke();
            
            // Add shield hits indicator
            ctx.fillStyle = `rgba(0, 150, 255, ${shieldAlpha * 0.5})`;
            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.fillText(`${shieldHitsRemaining.current}`, playerCenterX, playerCenterY - 100);
            ctx.restore();
        }

        // Berserker mode visual effect
        if (berserkerModeAbilityActive.current) {
            ctx.save();
            
            // Red screen tint for berserker mode
            ctx.fillStyle = "rgba(255, 0, 0, 0.08)";
            ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
            
            // Intense red aura around player
            const berserkerAlpha = Math.sin(currentTime * 0.02) * 0.4 + 0.6; // Pulsing effect
            ctx.strokeStyle = `rgba(255, 0, 0, ${berserkerAlpha})`;
            ctx.lineWidth = 6;
            ctx.setLineDash([8, 4]);
            ctx.beginPath();
            ctx.arc(playerCenterX, playerCenterY, 100, 0, 2 * Math.PI);
            ctx.stroke();
            
            // Inner red glow
            ctx.strokeStyle = `rgba(255, 50, 50, ${berserkerAlpha * 0.8})`;
            ctx.lineWidth = 3;
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.arc(playerCenterX, playerCenterY, 75, 0, 2 * Math.PI);
            ctx.stroke();
            
            // Berserker particles around player
            for (let i = 0; i < 12; i++) {
                const angle = (currentTime * 0.005 + i * (Math.PI * 2 / 12)) % (Math.PI * 2);
                const distance = 80 + Math.sin(currentTime * 0.01 + i) * 20;
                const particleX = playerCenterX + Math.cos(angle) * distance;
                const particleY = playerCenterY + Math.sin(angle) * distance;
                
                ctx.fillStyle = `rgba(255, ${50 + Math.sin(currentTime * 0.01 + i) * 50}, 0, ${berserkerAlpha})`;
                ctx.beginPath();
                ctx.arc(particleX, particleY, 4, 0, 2 * Math.PI);
                ctx.fill();
            }
            
            // Berserker mode text indicator
            ctx.fillStyle = `rgba(255, 0, 0, ${berserkerAlpha})`;
            ctx.font = "bold 28px Arial";
            ctx.textAlign = "center";
            ctx.fillText("BERSERKER", playerCenterX, playerCenterY - 130);
            
            ctx.restore();
        }
        
        // Freeze effect - blue overlay on screen
        if (freezeAbilityActive.current) {
            ctx.save();
            ctx.fillStyle = "rgba(0, 100, 255, 0.1)";
            ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
            
            // Draw freeze text
            ctx.fillStyle = "rgba(0, 150, 255, 0.8)";
            ctx.font = "bold 24px Arial";
            ctx.textAlign = "center";
            ctx.fillText("FROZEN", window.innerWidth / 2, 50);
            ctx.restore();
        }
        
        // Magnet effect - magnetic field lines
        if (magnetAbilityActive.current) {
            ctx.save();
            const magnetAlpha = 0.3 + Math.sin(currentTime * 0.015) * 0.2;
            ctx.strokeStyle = `rgba(255, 0, 255, ${magnetAlpha})`;
            ctx.lineWidth = 3;
            
            // Magnetic field lines radiating from player
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const startX = playerCenterX + Math.cos(angle) * 80;
                const startY = playerCenterY + Math.sin(angle) * 80;
                const endX = playerCenterX + Math.cos(angle) * 200;
                const endY = playerCenterY + Math.sin(angle) * 200;
                
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.stroke();
            }
            ctx.restore();
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
            if (immortalityAbilityActive.current && speedAbilityActive.current && reloadAbilityActive.current) {
                barY = playerRef.current.y - 58; // 12px above reload bar
            } else if ((immortalityAbilityActive.current && speedAbilityActive.current) || 
                      (immortalityAbilityActive.current && reloadAbilityActive.current) || 
                      (speedAbilityActive.current && reloadAbilityActive.current)) {
                barY = playerRef.current.y - 46; // 12px above the second bar
            } else if (immortalityAbilityActive.current || speedAbilityActive.current || reloadAbilityActive.current) {
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

        // TIER-BASED ENEMY SPAWNING SYSTEM
        const currentScore = score.current;
        
        // Check for tier unlocks and add notifications
        if (currentScore >= TIER_2_THRESHOLD && !tier2Unlocked.current) {
            tier2Unlocked.current = true;
            tierNotifications.current.push({
                text: "TIER 2 UNLOCKED! Advanced Enemies Incoming!",
                startTime: currentTime,
                duration: 4000,
                color: "#FF9800"
            });
        }
        
        if (currentScore >= TIER_3_THRESHOLD && !tier3Unlocked.current) {
            tier3Unlocked.current = true;
            tierNotifications.current.push({
                text: "TIER 3 UNLOCKED! Maximum Danger!",
                startTime: currentTime,
                duration: 4000,
                color: "#F44336"
            });
        }
        
        // Get responsive speed multiplier for consistent performance
        const speedMultiplier = getResponsiveSpeedMultiplier();
        
        // TIER 1 ENEMIES (Available from start - Score >= 0)
        const baseSpawnInterval = SPAWN_BASIC_ENEMY_TIME; 
        const minSpawnInterval = SPAWN_BASIC_ENEMY_TIME_MIN; 
        const currentSpawnInterval = (baseSpawnInterval / difficulty.current) * speedMultiplier;
        const spawnInterval = Math.max(minSpawnInterval, currentSpawnInterval);

        if (currentScore >= TIER_1_THRESHOLD && currentTime - lastSpawnTime.current > spawnInterval) {
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

        // TIER 2 ENEMIES (Unlock at Score >= 150)
        if (currentScore >= TIER_2_THRESHOLD) {
            // Triple Shoot Enemy spawning
            const trippleShootEnemyBaseSpawnInterval = SPAWN_TRIPPLESHOOT_ENEMY_TIME;
            const trippleShootEnemyMinSpawnInterval = SPAWN_TRIPPLESHOOT_ENEMY_TIME_MIN;
            const currentTrippleShootEnemySpawnInterval = (trippleShootEnemyBaseSpawnInterval / difficulty.current) * speedMultiplier;
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

            // Bomber enemy spawning (TIER 2)
            const bomberBaseSpawnInterval = SPAWN_BOMBER_ENEMY_TIME;
            const bomberMinSpawnInterval = SPAWN_BOMBER_ENEMY_TIME_MIN;
            const currentBomberSpawnInterval = (bomberBaseSpawnInterval / difficulty.current) * speedMultiplier;
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
        }

        // TIER 3 ENEMIES (Unlock at Score >= 300)
        if (currentScore >= TIER_3_THRESHOLD) {
            // Teleporter enemy spawning
            const teleporterBaseSpawnInterval = SPAWN_TELEPORTER_ENEMY_TIME;
            const teleporterMinSpawnInterval = SPAWN_TELEPORTER_ENEMY_TIME_MIN;
            const currentTeleporterSpawnInterval = (teleporterBaseSpawnInterval / difficulty.current) * speedMultiplier;
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
                let playerSpeedMultiplier = SPEED_PLAYER_MULTIPLIER;
                if (berserkerModeAbilityActive.current) {
                    playerSpeedMultiplier *= BERSERKER_MOVE_SPEED_MULTIPLIER;
                }
                playerRef.current.speed = PLAYER_SPEED * playerSpeedMultiplier * responsiveMultiplier;
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
                let playerSpeedMultiplier = 1;
                if (berserkerModeAbilityActive.current) {
                    playerSpeedMultiplier *= BERSERKER_MOVE_SPEED_MULTIPLIER;
                }
                playerRef.current.speed = PLAYER_SPEED * playerSpeedMultiplier * responsiveMultiplier;
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

        // Handle ability keys
        const currentAbilityConfig = getAbilityConfig();
        
        // T Ability handler (teleport or immortality)
        if ((keys.current["t"] || keys.current["T"]) && currentAbilityConfig.T.available) {
            console.log("T key pressed, T_ability:", T_ability, "cooldown:", teleportAbilityOnCooldown.current);
            if (T_ability === 'teleport' && !teleportAbilityOnCooldown.current) {
                console.log("Teleport ability activated!");
                teleportAbilityActive.current = true;
                teleportAbilityStartTime.current = currentTime;
                teleportAbilityOnCooldown.current = true;
                teleportAbilityCooldownStartTime.current = currentTime;
                
                const mousePos = mousemove.current;
                console.log("Mouse position:", mousePos);
                
                // Teleport player to mouse position first
                const teleportX = mousePos.x - playerRef.current.width / 2;
                const teleportY = mousePos.y - playerRef.current.height / 2;
                
                // Keep player within screen bounds
                playerRef.current.x = Math.max(0, Math.min(teleportX, window.innerWidth - playerRef.current.width));
                playerRef.current.y = Math.max(0, Math.min(teleportY, window.innerHeight - playerRef.current.height));
                
                // Kill all enemies around the mouse position (where player will teleport)
                console.log("Mouse position for killing:", mousePos.x, mousePos.y);
                
                // Count enemies before destruction
                const enemiesBefore = basicEnemyRef.current.length + trippleShootEnemyRef.current.length + teleporterEnemyRef.current.length + bomberEnemyRef.current.length;
                console.log("Enemies before teleport:", enemiesBefore);
                
                // Destroy basic enemies in teleport area
                basicEnemyRef.current = basicEnemyRef.current.filter(enemy => {
                    const ex = enemy.x + enemy.width / 2;
                    const ey = enemy.y + enemy.height / 4;
                    const distance = Math.sqrt((ex - mousePos.x) ** 2 + (ey - mousePos.y) ** 2);
                    if (distance <= TELEPORT_DISTANCE) {
                        console.log("Killing basic enemy at distance:", distance);
                        // Create kill effects
                        createKillEffect(ex, ey, 10);
                        score.current += 10; // Add score for destroyed basic enemy
                        return false;
                    }
                    return true;
                });
                
                // Destroy triple shoot enemies in teleport area
                trippleShootEnemyRef.current = trippleShootEnemyRef.current.filter(enemy => {
                    const ex = enemy.x + enemy.width / 2;
                    const ey = enemy.y + enemy.height / 2;
                    const distance = Math.sqrt((ex - mousePos.x) ** 2 + (ey - mousePos.y) ** 2);
                    if (distance <= TELEPORT_DISTANCE) {
                        console.log("Killing triple shoot enemy at distance:", distance);
                        // Create kill effects
                        createKillEffect(ex, ey, 30);
                        
                        score.current += 30; // Add score for destroyed triple shoot enemy
                        return false;
                    }
                    return true;
                });
                
                // Destroy teleporter enemies in teleport area
                teleporterEnemyRef.current = teleporterEnemyRef.current.filter(enemy => {
                    const ex = enemy.x + enemy.width / 2;
                    const ey = enemy.y + enemy.height / 2;
                    const distance = Math.sqrt((ex - mousePos.x) ** 2 + (ey - mousePos.y) ** 2);
                    if (distance <= TELEPORT_DISTANCE) {
                        console.log("Killing teleporter enemy at distance:", distance);
                        // Create kill effects
                        createKillEffect(ex, ey, 35);
                        
                        score.current += 35; // Add score for destroyed teleporter enemy
                        return false;
                    }
                    return true;
                });
                
                // Destroy bomber enemies in teleport area
                bomberEnemyRef.current = bomberEnemyRef.current.filter(enemy => {
                    const ex = enemy.x + enemy.width / 2;
                    const ey = enemy.y + enemy.height / 2;
                    const distance = Math.sqrt((ex - mousePos.x) ** 2 + (ey - mousePos.y) ** 2);
                    if (distance <= TELEPORT_DISTANCE) {
                        console.log("Killing bomber enemy at distance:", distance);
                        // Create kill effects
                        createKillEffect(ex, ey, 25);
                        
                        score.current += 25; // Add score for destroyed bomber enemy
                        return false;
                    }
                    return true;
                });
                
                // Count enemies after destruction
                const enemiesAfter = basicEnemyRef.current.length + trippleShootEnemyRef.current.length + teleporterEnemyRef.current.length + bomberEnemyRef.current.length;
                console.log("Enemies after teleport:", enemiesAfter, "Killed:", enemiesBefore - enemiesAfter);
                
                // Destroy all enemy bullets in teleport area
                basicEnemyBulletsRef.current = basicEnemyBulletsRef.current.filter(bullet => {
                    const distance = Math.sqrt((bullet.x - mousePos.x) ** 2 + (bullet.y - mousePos.y) ** 2);
                    return distance > TELEPORT_DISTANCE;
                });
                
                trippleShootEnemyBulletsRef.current = trippleShootEnemyBulletsRef.current.filter(bullet => {
                    const distance = Math.sqrt((bullet.x - mousePos.x) ** 2 + (bullet.y - mousePos.y) ** 2);
                    return distance > TELEPORT_DISTANCE;
                });
                
                teleporterEnemyBulletsRef.current = teleporterEnemyBulletsRef.current.filter(bullet => {
                    const distance = Math.sqrt((bullet.x - mousePos.x) ** 2 + (bullet.y - mousePos.y) ** 2);
                    return distance > TELEPORT_DISTANCE;
                });

                setTimeout(() => {
                    teleportAbilityActive.current = false;
                }, TELEPORT_DURATION);

                setTimeout(() => {
                    teleportAbilityOnCooldown.current = false;
                }, TELEPORT_COOLDOWN);
                
                // Reset key state to prevent repeated triggering
                keys.current["t"] = false;
                keys.current["T"] = false;
            } else if (T_ability === 'immortality' && !immortalityAbilityOnCooldown.current) {
                // Immortality ability - player becomes invulnerable for a duration
                immortalityAbilityActive.current = true;
                immortalityAbilityStartTime.current = currentTime;
                immortalityAbilityOnCooldown.current = true;
                immortalityAbilityCooldownStartTime.current = currentTime;
                
                // Remove immortality after duration
                setTimeout(() => {
                    immortalityAbilityActive.current = false;
                }, IMMORTALITY_DURATION);
                
                // Reset cooldown
                setTimeout(() => {
                    immortalityAbilityOnCooldown.current = false;
                }, IMMORTALITY_COOLDOWN);
                
                // Reset key state to prevent repeated triggering
                keys.current["t"] = false;
                keys.current["T"] = false;
            } else if (T_ability === 'scoreboost' && !scoreBoostAbilityOnCooldown.current) {
                // Score Boost ability - instantly adds points to score
                score.current += SCOREBOOST_POINTS;
                scoreBoostAbilityOnCooldown.current = true;
                scoreBoostAbilityCooldownStartTime.current = currentTime;
                
                // Create visual effect to show score boost
                scoreBoostEffectActive.current = true;
                scoreBoostEffectStartTime.current = currentTime;
                
                // Remove visual effect after short duration
                setTimeout(() => {
                    scoreBoostEffectActive.current = false;
                }, 1000);
                
                // Reset cooldown
                setTimeout(() => {
                    scoreBoostAbilityOnCooldown.current = false;
                }, SCOREBOOST_COOLDOWN);
                
                // Reset key state to prevent repeated triggering
                keys.current["t"] = false;
                keys.current["T"] = false;
            } else if (T_ability === 'soldierHelp' && !soldierAbilityOnCooldown.current) {
                // Soldier Help ability - spawn a soldier at mouse position (same as King's combat)
                const currentTime = performance.now();
                
                // Spawn soldier at clicked position
                soldierAbilitySoldiers.current.push({
                    x: mousemove.current.x - 15, // Center the soldier
                    y: mousemove.current.y - 15,
                    width: 120,
                    height: 120,
                    spawnTime: Date.now(), // Keep Date.now() for soldier lifetime
                    lastShootTime: 0
                });
                
                soldierAbilityOnCooldown.current = true;
                soldierAbilityCooldownStartTime.current = currentTime;
                
                // Use boosted cooldown if reload ability is active
                const cooldownToUse = reloadAbilityActive.current ? SOLDIER_ABILITY_COOLDOWN_BOOSTED : SOLDIER_ABILITY_COOLDOWN;
                
                // Reset cooldown
                setTimeout(() => {
                    soldierAbilityOnCooldown.current = false;
                }, cooldownToUse);
                
                // Reset key state to prevent repeated triggering
                keys.current["t"] = false;
                keys.current["T"] = false;
            } else if (T_ability === 'magnet' && !magnetAbilityOnCooldown.current) {
                // Magnet ability - attract enemies and projectiles to player
                const currentTime = performance.now();
                
                magnetAbilityActive.current = true;
                magnetAbilityOnCooldown.current = true;
                magnetAbilityCooldownStartTime.current = currentTime;
                
                // Deactivate magnet after duration
                setTimeout(() => {
                    magnetAbilityActive.current = false;
                }, MAGNET_DURATION);
                
                // Reset cooldown
                setTimeout(() => {
                    magnetAbilityOnCooldown.current = false;
                }, MAGNET_COOLDOWN);
                
                // Reset key state to prevent repeated triggering
                keys.current["t"] = false;
                keys.current["T"] = false;
            } else if (T_ability === 'mirrorclone' && !mirrorCloneAbilityOnCooldown.current) {
                // Mirror Clone ability - create mirror clones of player
                const currentTime = performance.now();
                const playerCenterX = playerRef.current.x + playerRef.current.width / 2;
                const playerCenterY = playerRef.current.y + playerRef.current.height / 2;
                
                // Create mirror clones at offset positions
                for (let i = 0; i < MIRROR_CLONE_COUNT; i++) {
                    const angle = (i * 2 * Math.PI) / MIRROR_CLONE_COUNT;
                    const offsetX = Math.cos(angle) * 100;
                    const offsetY = Math.sin(angle) * 100;
                    
                    mirrorClones.current.push({
                        x: playerCenterX + offsetX - playerRef.current.width / 2,
                        y: playerCenterY + offsetY - playerRef.current.height / 2,
                        width: playerRef.current.width,
                        height: playerRef.current.height,
                        timestamp: performance.now(),
                        lastShootTime: 0
                    });
                }
                
                mirrorCloneAbilityOnCooldown.current = true;
                mirrorCloneAbilityCooldownStartTime.current = currentTime;
                
                // Reset cooldown
                setTimeout(() => {
                    mirrorCloneAbilityOnCooldown.current = false;
                }, MIRROR_CLONE_COOLDOWN);
                
                // Reset key state to prevent repeated triggering
                keys.current["t"] = false;
                keys.current["T"] = false;
            } else if (T_ability === 'berserkermode' && !berserkerModeAbilityOnCooldown.current) {
                // Berserker Mode ability - increase damage and speed
                const currentTime = performance.now();
                
                berserkerModeAbilityActive.current = true;
                berserkerModeAbilityOnCooldown.current = true;
                berserkerModeAbilityCooldownStartTime.current = currentTime;
                
                // Apply berserker attack speed boost
                if (!reloadAbilityActive.current) {
                    reloadTimeRef.current = RELOADTIME * BERSERKER_ATTACK_SPEED_MULTIPLIER;
                }
                
                // Deactivate berserker mode after duration
                setTimeout(() => {
                    berserkerModeAbilityActive.current = false;
                    // Reset reload time when berserker mode ends
                    if (!reloadAbilityActive.current) {
                        reloadTimeRef.current = RELOADTIME;
                    }
                }, BERSERKER_MODE_DURATION);
                
                // Reset cooldown
                setTimeout(() => {
                    berserkerModeAbilityOnCooldown.current = false;
                }, BERSERKER_MODE_COOLDOWN);
                
                // Reset key state to prevent repeated triggering
                keys.current["t"] = false;
                keys.current["T"] = false;
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
            // Check wall collision
            for (let wall of walls.current) {
                if (bullet.x + 20 > wall.x && bullet.x < wall.x + wall.width &&
                    bullet.y + 20 > wall.y && bullet.y < wall.y + wall.height) {
                    return false; // Remove bullet if it hits wall
                }
            }
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

        // Update and draw soldiers (King)
        const currentTimeMs = Date.now();
        
        // Remove expired soldiers
        soldiers.current = soldiers.current.filter(soldier => {
            return currentTimeMs - soldier.spawnTime < KING_SOLDIER_LIFETIME;
        });
        
        // Update and draw soldiers
        soldiers.current.forEach((soldier, index) => {
            // Find nearest enemy to target
            let nearestEnemy = null;
            let nearestDistance = KING_SOLDIER_RANGE;
            
            [...basicEnemyRef.current, ...trippleShootEnemyRef.current, ...bomberEnemyRef.current, ...teleporterEnemyRef.current].forEach(enemy => {
                const dx = enemy.x + enemy.width/2 - (soldier.x + soldier.width/2);
                const dy = enemy.y + enemy.height/2 - (soldier.y + soldier.height/2);
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < nearestDistance) {
                    nearestEnemy = enemy;
                    nearestDistance = distance;
                }
            });
            
            // Shoot at nearest enemy if in range and off cooldown
            if (nearestEnemy && currentTimeMs - soldier.lastShootTime >= KING_SOLDIER_SHOOT_COOLDOWN) {
                const soldierCenterX = soldier.x + soldier.width/2;
                const soldierCenterY = soldier.y + soldier.height/2;
                const targetCenterX = nearestEnemy.x + nearestEnemy.width/2;
                const targetCenterY = nearestEnemy.y + nearestEnemy.height/2;
                
                const dx = targetCenterX - soldierCenterX;
                const dy = targetCenterY - soldierCenterY;
                const length = Math.sqrt(dx * dx + dy * dy);
                const dirX = dx / length;
                const dirY = dy / length;
                const bulletAngle = Math.atan2(dy, dx);
                
                soldierBullets.current.push({
                    x: soldierCenterX - 5,
                    y: soldierCenterY - 5,
                    dirX: dirX,
                    dirY: dirY,
                    angle: bulletAngle,
                    width: 10,
                    height: 10
                });
                
                soldier.lastShootTime = currentTimeMs;
            }
            
            // Draw soldier
            if (soldierImageRef.current) {
                ctx.drawImage(soldierImageRef.current, soldier.x, soldier.y, soldier.width, soldier.height);
            } else {
                ctx.fillStyle = "blue";
                ctx.fillRect(soldier.x, soldier.y, soldier.width, soldier.height);
            }
            
            // Draw soldier collision boundary (debug visualization)
            if (showCollision) {
                const soldierCenterX = soldier.x + soldier.width/2;
                const soldierCenterY = soldier.y + soldier.height/2;
                const soldierRadius = 15;
                
                ctx.strokeStyle = "rgba(0, 0, 255, 0.6)"; // Semi-transparent blue
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(soldierCenterX, soldierCenterY, soldierRadius, 0, 2 * Math.PI);
                ctx.stroke();
                
                // Draw soldier shooting range
                ctx.strokeStyle = "rgba(0, 0, 255, 0.2)"; // Very light blue
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(soldierCenterX, soldierCenterY, KING_SOLDIER_RANGE, 0, 2 * Math.PI);
                ctx.stroke();
            }
        });
        
        // Update and draw soldier bullets
        soldierBullets.current.forEach((bullet, index) => {
            bullet.x += bullet.dirX * KING_SOLDIER_BULLET_SPEED;
            bullet.y += bullet.dirY * KING_SOLDIER_BULLET_SPEED;
            
            // Draw soldier bullet (smaller than player bullets)
            ctx.fillStyle = "orange";
            ctx.beginPath();
            ctx.arc(bullet.x + bullet.width/2, bullet.y + bullet.height/2, 5, 0, 2 * Math.PI);
            ctx.fill();
            
            // Draw soldier bullet collision boundary (debug visualization)
            if (showCollision) {
                const bulletCenterX = bullet.x + bullet.width/2;
                const bulletCenterY = bullet.y + bullet.height/2;
                const bulletRadius = 5;
                
                ctx.strokeStyle = "rgba(255, 165, 0, 0.6)"; // Semi-transparent orange
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(bulletCenterX, bulletCenterY, bulletRadius, 0, 2 * Math.PI);
                ctx.stroke();
            }
        });
        
        // Remove soldier bullets that are out of bounds
        soldierBullets.current = soldierBullets.current.filter((bullet) => {
            return bullet.x >= -50 && bullet.x <= window.innerWidth + 50 && bullet.y >= -50 && bullet.y <= window.innerHeight + 50;
        });

        // Handle Soldier Ability soldiers (same logic as King's soldiers but separate arrays)
        // Remove expired ability soldiers
        soldierAbilitySoldiers.current = soldierAbilitySoldiers.current.filter(soldier => {
            return currentTimeMs - soldier.spawnTime < KING_SOLDIER_LIFETIME;
        });

        // Update and draw ability soldiers
        soldierAbilitySoldiers.current.forEach((soldier, index) => {
            // Find nearest enemy to target
            let nearestEnemy = null;
            let nearestDistance = KING_SOLDIER_RANGE;
            
            [...basicEnemyRef.current, ...trippleShootEnemyRef.current, ...bomberEnemyRef.current, ...teleporterEnemyRef.current].forEach(enemy => {
                const dx = enemy.x + enemy.width/2 - (soldier.x + soldier.width/2);
                const dy = enemy.y + enemy.height/2 - (soldier.y + soldier.height/2);
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < nearestDistance) {
                    nearestEnemy = enemy;
                    nearestDistance = distance;
                }
            });
            
            // Shoot at nearest enemy if in range and off cooldown
            if (nearestEnemy && currentTimeMs - soldier.lastShootTime >= KING_SOLDIER_SHOOT_COOLDOWN) {
                const soldierCenterX = soldier.x + soldier.width/2;
                const soldierCenterY = soldier.y + soldier.height/2;
                const targetCenterX = nearestEnemy.x + nearestEnemy.width/2;
                const targetCenterY = nearestEnemy.y + nearestEnemy.height/2;
                
                const dx = targetCenterX - soldierCenterX;
                const dy = targetCenterY - soldierCenterY;
                const length = Math.sqrt(dx * dx + dy * dy);
                const dirX = dx / length;
                const dirY = dy / length;
                const bulletAngle = Math.atan2(dy, dx);
                
                soldierAbilitySoldierBullets.current.push({
                    x: soldierCenterX - 5,
                    y: soldierCenterY - 5,
                    dirX: dirX,
                    dirY: dirY,
                    angle: bulletAngle,
                    width: 10,
                    height: 10
                });
                
                soldier.lastShootTime = currentTimeMs;
            }
            
            // Draw ability soldier (use same sprite as King's soldiers)
            if (soldierImageRef.current) {
                ctx.drawImage(soldierImageRef.current, soldier.x, soldier.y, soldier.width, soldier.height);
            } else {
                ctx.fillStyle = "green"; // Different color to distinguish from King's soldiers
                ctx.fillRect(soldier.x, soldier.y, soldier.width, soldier.height);
            }
            
            // Draw soldier collision boundary (debug visualization)
            if (showCollision) {
                const soldierCenterX = soldier.x + soldier.width/2;
                const soldierCenterY = soldier.y + soldier.height/2;
                const soldierRadius = 15;
                
                ctx.strokeStyle = "rgba(0, 255, 0, 0.6)"; // Semi-transparent green to distinguish from King's soldiers
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(soldierCenterX, soldierCenterY, soldierRadius, 0, 2 * Math.PI);
                ctx.stroke();
                
                // Draw soldier shooting range
                ctx.strokeStyle = "rgba(0, 255, 0, 0.2)"; // Very light green
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(soldierCenterX, soldierCenterY, KING_SOLDIER_RANGE, 0, 2 * Math.PI);
                ctx.stroke();
            }
        });
        
        // Update and draw ability soldier bullets
        soldierAbilitySoldierBullets.current.forEach((bullet, index) => {
            bullet.x += bullet.dirX * KING_SOLDIER_BULLET_SPEED;
            bullet.y += bullet.dirY * KING_SOLDIER_BULLET_SPEED;
            
            // Draw ability soldier bullet (same as King's soldier bullets but different color)
            ctx.fillStyle = "lime"; // Different color to distinguish from King's soldier bullets
            ctx.beginPath();
            ctx.arc(bullet.x + bullet.width/2, bullet.y + bullet.height/2, 5, 0, 2 * Math.PI);
            ctx.fill();
            
            // Draw soldier bullet collision boundary (debug visualization)
            if (showCollision) {
                const bulletCenterX = bullet.x + bullet.width/2;
                const bulletCenterY = bullet.y + bullet.height/2;
                const bulletRadius = 5;
                
                ctx.strokeStyle = "rgba(0, 255, 0, 0.6)"; // Semi-transparent green
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(bulletCenterX, bulletCenterY, bulletRadius, 0, 2 * Math.PI);
                ctx.stroke();
            }
        });
        
        // Remove ability soldier bullets that are out of bounds
        soldierAbilitySoldierBullets.current = soldierAbilitySoldierBullets.current.filter((bullet) => {
            return bullet.x >= -50 && bullet.x <= window.innerWidth + 50 && bullet.y >= -50 && bullet.y <= window.innerHeight + 50;
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

        // Process new abilities effects
        const abilityTime = performance.now();
        
        // Lightning strikes - damage enemies and remove expired strikes
        lightningStrikes.current = lightningStrikes.current.filter(strike => {
            const strikeAge = abilityTime - strike.timestamp;
            if (strikeAge > 500) return false; // Strike lasts 0.5 seconds
            
            // Damage all enemy types in strike radius
            [basicEnemyRef, trippleShootEnemyRef, bomberEnemyRef, teleporterEnemyRef].forEach(enemyArray => {
                enemyArray.current = enemyArray.current.filter(enemy => {
                    const enemyCenterX = enemy.x + enemy.width / 2;
                    const enemyCenterY = enemy.y + enemy.height / 2;
                    const distance = Math.sqrt((enemyCenterX - strike.x) ** 2 + (enemyCenterY - strike.y) ** 2);
                    if (distance <= strike.radius) {
                        score.current += 20;
                        return false;
                    }
                    return true;
                });
            });
            
            return true;
        });
        
        // Poison clouds - damage enemies over time and remove expired clouds
        poisonClouds.current = poisonClouds.current.filter(cloud => {
            const cloudAge = abilityTime - cloud.timestamp;
            if (cloudAge > POISON_CLOUD_DURATION) return false;
            
            // Damage enemies every 0.5 seconds
            if (Math.floor(cloudAge / 500) > Math.floor((cloudAge - 16) / 500)) {
                [basicEnemyRef, trippleShootEnemyRef, bomberEnemyRef, teleporterEnemyRef].forEach(enemyArray => {
                    enemyArray.current = enemyArray.current.filter(enemy => {
                        const enemyCenterX = enemy.x + enemy.width / 2;
                        const enemyCenterY = enemy.y + enemy.height / 2;
                        const distance = Math.sqrt((enemyCenterX - cloud.x) ** 2 + (enemyCenterY - cloud.y) ** 2);
                        if (distance <= cloud.radius) {
                            score.current += 5;
                            return false;
                        }
                        return true;
                    });
                });
            }
            
            return true;
        });
        
        // Meteors - damage enemies and remove after impact
        meteors.current = meteors.current.filter(meteor => {
            const meteorAge = abilityTime - meteor.timestamp;
            if (meteorAge > 1000) return false; // Meteor lasts 1 second
            
            // Damage all enemy types in meteor radius
            [basicEnemyRef, trippleShootEnemyRef, bomberEnemyRef, teleporterEnemyRef].forEach(enemyArray => {
                enemyArray.current = enemyArray.current.filter(enemy => {
                    const enemyCenterX = enemy.x + enemy.width / 2;
                    const enemyCenterY = enemy.y + enemy.height / 2;
                    const distance = Math.sqrt((enemyCenterX - meteor.x) ** 2 + (enemyCenterY - meteor.y) ** 2);
                    if (distance <= meteor.radius) {
                        score.current += 40;
                        return false;
                    }
                    return true;
                });
            });
            
            return true;
        });
        
        // Remove expired meteor targets
        meteorTargets.current = meteorTargets.current.filter(target => {
            return abilityTime - target.timestamp < METEOR_DELAY;
        });
        
        // Remove expired walls
        walls.current = walls.current.filter(wall => {
            return abilityTime - wall.timestamp < WALL_CREATION_LIFETIME;
        });
        
        // Remove expired mirror clones
        mirrorClones.current = mirrorClones.current.filter(clone => {
            return abilityTime - clone.timestamp < MIRROR_CLONE_DURATION;
        });
        
        // Mirror clones shooting
        mirrorClones.current.forEach(clone => {
            const now = Date.now();
            if (now - clone.lastShootTime > 1000) { // Clone shoots every 1 second
                clone.lastShootTime = now;
                
                // Find nearest enemy to clone
                let nearestEnemy = null;
                let nearestDistance = Infinity;
                
                [basicEnemyRef, trippleShootEnemyRef, bomberEnemyRef, teleporterEnemyRef].forEach(enemyArray => {
                    enemyArray.current.forEach(enemy => {
                        const distance = Math.sqrt((enemy.x - clone.x) ** 2 + (enemy.y - clone.y) ** 2);
                        if (distance < nearestDistance) {
                            nearestDistance = distance;
                            nearestEnemy = enemy;
                        }
                    });
                });
                
                if (nearestEnemy) {
                    const cloneCenterX = clone.x + clone.width / 2;
                    const cloneCenterY = clone.y + clone.height / 2;
                    const enemyCenterX = nearestEnemy.x + nearestEnemy.width / 2;
                    const enemyCenterY = nearestEnemy.y + nearestEnemy.height / 2;
                    
                    const dx = enemyCenterX - cloneCenterX;
                    const dy = enemyCenterY - cloneCenterY;
                    const length = Math.sqrt(dx * dx + dy * dy);
                    
                    if (length > 0) {
                        bullets.current.push({
                            x: cloneCenterX - 50,
                            y: cloneCenterY - 50,
                            dirX: dx / length,
                            dirY: dy / length,
                            angle: Math.atan2(dy, dx),
                            width: 20,
                            height: 20
                        });
                    }
                }
            }
        });

        // Draw basic enemies
        basicEnemyRef.current.forEach((enemy, index) => {
            // Skip movement if frozen
            if (freezeAbilityActive.current) {
                // Don't move enemy when frozen, but still draw it
            } else {
                // Move enemy towards player
                let dx = (playerRef.current.x + playerRef.current.width / 2) - (enemy.x + enemy.width / 2);
                let dy = (playerRef.current.y + playerRef.current.height / 2) - (enemy.y + enemy.height / 2);
                
                // Apply magnet effect if active
                if (magnetAbilityActive.current) {
                    const playerCenterX = playerRef.current.x + playerRef.current.width / 2;
                    const playerCenterY = playerRef.current.y + playerRef.current.height / 2;
                    const enemyCenterX = enemy.x + enemy.width / 2;
                    const enemyCenterY = enemy.y + enemy.height / 2;
                    
                    const magnetDx = playerCenterX - enemyCenterX;
                    const magnetDy = playerCenterY - enemyCenterY;
                    const magnetLength = Math.sqrt(magnetDx * magnetDx + magnetDy * magnetDy);
                    
                    if (magnetLength > 0) {
                        // Extremely strong magnet when close
                        const magnetStrength = magnetLength < 100 ? 8.0 : 2.0;
                        dx += (magnetDx / magnetLength) * magnetStrength; // Add to existing movement
                        dy += (magnetDy / magnetLength) * magnetStrength; // Add to existing movement
                    }
                }
                
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
                            dx += gravityDx / gravityLength * pullStrength; // Add to existing movement
                            dy += gravityDy / gravityLength * pullStrength; // Add to existing movement
                        }
                    }
                }
                
                const length = Math.sqrt(dx * dx + dy * dy);
                const dirX = length > 0 ? dx / length : 0;
                const dirY = length > 0 ? dy / length : 0;

                // Calculate new position
                const newX = enemy.x + dirX * basicEnemySpeed.current;
                const newY = enemy.y + dirY * basicEnemySpeed.current;
                
                // Check wall collision before moving
                let canMove = true;
                for (let wall of walls.current) {
                    if (newX + enemy.width > wall.x && newX < wall.x + wall.width &&
                        newY + enemy.height > wall.y && newY < wall.y + wall.height) {
                        canMove = false;
                        break;
                    }
                }
                
                // Only move if not colliding with walls
                if (canMove) {
                    enemy.x = newX;
                    enemy.y = newY;
                }
            }

            // Calculate collision position on goblin's head instead of center
            const enemyCenterX = enemy.x + enemy.width / 2;  // Střed horizontálně
            const enemyCenterY = enemy.y + enemy.height / 4; // Hlava - čtvrtina z vrchu
            
            // Calculate rotation towards player (independent of movement effects)
            const playerCenterX = playerRef.current.x + playerRef.current.width / 2;
            const playerCenterY = playerRef.current.y + playerRef.current.height / 2;
            const rotationDx = playerCenterX - enemyCenterX;
            const rotationDy = playerCenterY - enemyCenterY;
            const enemyRotationAngle = Math.atan2(rotationDy, rotationDx);
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
            // Skip movement if frozen
            if (!freezeAbilityActive.current) {
                // Move enemy towards player
                let dx = (playerRef.current.x + playerRef.current.width / 2) - (enemy.x + enemy.width / 2);
                let dy = (playerRef.current.y + playerRef.current.height / 2) - (enemy.y + enemy.height / 2);
                
                // Apply magnet effect if active
                if (magnetAbilityActive.current) {
                    const playerCenterX = playerRef.current.x + playerRef.current.width / 2;
                    const playerCenterY = playerRef.current.y + playerRef.current.height / 2;
                    const enemyCenterX = enemy.x + enemy.width / 2;
                    const enemyCenterY = enemy.y + enemy.height / 2;
                    
                    const magnetDx = playerCenterX - enemyCenterX;
                    const magnetDy = playerCenterY - enemyCenterY;
                    const magnetLength = Math.sqrt(magnetDx * magnetDx + magnetDy * magnetDy);
                    
                    if (magnetLength > 0) {
                        // Extremely strong magnet when close
                        const magnetStrength = magnetLength < 100 ? 8.0 : 2.0;
                        dx = (magnetDx / magnetLength) * magnetStrength;
                        dy = (magnetDy / magnetLength) * magnetStrength;
                    }
                }
                
                const length = Math.sqrt(dx * dx + dy * dy);
                const dirX = length > 0 ? dx / length : 0;
                const dirY = length > 0 ? dy / length : 0;

                // Calculate new position
                const newX = enemy.x + dirX * trippleShootEnemySpeed.current;
                const newY = enemy.y + dirY * trippleShootEnemySpeed.current;
                
                // Check wall collision before moving
                let canMove = true;
                for (let wall of walls.current) {
                    if (newX + enemy.width > wall.x && newX < wall.x + wall.width &&
                        newY + enemy.height > wall.y && newY < wall.y + wall.height) {
                        canMove = false;
                        break;
                    }
                }
                
                // Only move if not colliding with walls
                if (canMove) {
                    enemy.x = newX;
                    enemy.y = newY;
                }
                enemy.y += dirY * trippleShootEnemySpeed.current;
            }

            // Calculate rotation angle towards player (face towards player with feather behind)
            const enemyCenterX = enemy.x + enemy.width / 2;
            const enemyCenterY = enemy.y + enemy.height / 2;
            
            // Calculate rotation towards player (independent of movement effects)
            const playerCenterX = playerRef.current.x + playerRef.current.width / 2;
            const playerCenterY = playerRef.current.y + playerRef.current.height / 2;
            const rotationDx = playerCenterX - enemyCenterX;
            const rotationDy = playerCenterY - enemyCenterY;
            const enemyRotationAngle = Math.atan2(rotationDy, rotationDx);
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
            
            // Skip movement if frozen
            if (!freezeAbilityActive.current) {
                // Move bomber towards player (slower movement)
                let dx = (playerRef.current.x + playerRef.current.width / 2) - (enemy.x + enemy.width / 2);
                let dy = (playerRef.current.y + playerRef.current.height / 2) - (enemy.y + enemy.height / 2);
                
                // Apply magnet effect if active
                if (magnetAbilityActive.current) {
                    const playerCenterX = playerRef.current.x + playerRef.current.width / 2;
                    const playerCenterY = playerRef.current.y + playerRef.current.height / 2;
                    const enemyCenterX = enemy.x + enemy.width / 2;
                    const enemyCenterY = enemy.y + enemy.height / 2;
                    
                    const magnetDx = playerCenterX - enemyCenterX;
                    const magnetDy = playerCenterY - enemyCenterY;
                    const magnetLength = Math.sqrt(magnetDx * magnetDx + magnetDy * magnetDy);
                    
                    if (magnetLength > 0) {
                        // Extremely strong magnet when close
                        const magnetStrength = magnetLength < 100 ? 8.0 : 2.0;
                        dx = (magnetDx / magnetLength) * magnetStrength;
                        dy = (magnetDy / magnetLength) * magnetStrength;
                    }
                }
                
                const length = Math.sqrt(dx * dx + dy * dy);
                const dirX = dx / length;
                const dirY = dy / length;

                // Calculate new position
                const newX = enemy.x + dirX * bomberEnemySpeed.current;
                const newY = enemy.y + dirY * bomberEnemySpeed.current;
                
                // Check wall collision before moving
                let canMove = true;
                for (let wall of walls.current) {
                    if (newX + enemy.width > wall.x && newX < wall.x + wall.width &&
                        newY + enemy.height > wall.y && newY < wall.y + wall.height) {
                        canMove = false;
                        break;
                    }
                }
                
                // Only move if not colliding with walls
                if (canMove) {
                    enemy.x = newX;
                    enemy.y = newY;
                }
            }

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
                    // Check shield protection
                    if (shieldAbilityActive.current && shieldHitsRemaining.current > 0) {
                        shieldHitsRemaining.current--;
                        if (shieldHitsRemaining.current <= 0) {
                            shieldAbilityActive.current = false;
                        }
                    } else {
                        looseRef.current = true;
                        setLoose(true);
                    }
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
                
                // Calculate rotation towards player
                const playerCenterX = playerRef.current.x + playerRef.current.width / 2;
                const playerCenterY = playerRef.current.y + playerRef.current.height / 2;
                const rotationDx = playerCenterX - enemyCenterX;
                const rotationDy = playerCenterY - enemyCenterY;
                const bomberRotationAngle = Math.atan2(rotationDy, rotationDx);
                
                // Warning flash effect
                if (isWarning) {
                    const flashIntensity = Math.sin((performance.now() % 200) / 200 * Math.PI * 2) * 0.5 + 0.5;
                    ctx.shadowColor = 'red';
                    ctx.shadowBlur = 20 * flashIntensity;
                }
                
                // Apply rotation
                ctx.translate(enemyCenterX, enemyCenterY);
                ctx.rotate(bomberRotationAngle);
                
                if (bomberImageRef.current) {
                    // Add red tint when warning
                    if (isWarning) {
                        ctx.filter = 'hue-rotate(0deg) saturate(2) brightness(1.2)';
                    }
                    
                    ctx.drawImage(
                        bomberImageRef.current, 
                        -enemy.width / 2, 
                        -enemy.height / 2, 
                        enemy.width, 
                        enemy.height
                    );
                    ctx.filter = 'none';
                } else {
                    ctx.fillStyle = isWarning ? "red" : enemy.color;
                    ctx.fillRect(-enemy.width / 2, -enemy.height / 2, enemy.width, enemy.height);
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
            // Move towards player when not teleporting and not frozen
            if (!enemy.teleporting && !freezeAbilityActive.current) {
                let dx = (playerRef.current.x + playerRef.current.width / 2) - (enemy.x + enemy.width / 2);
                let dy = (playerRef.current.y + playerRef.current.height / 2) - (enemy.y + enemy.height / 2);
                
                // Apply magnet effect if active
                if (magnetAbilityActive.current) {
                    const playerCenterX = playerRef.current.x + playerRef.current.width / 2;
                    const playerCenterY = playerRef.current.y + playerRef.current.height / 2;
                    const enemyCenterX = enemy.x + enemy.width / 2;
                    const enemyCenterY = enemy.y + enemy.height / 2;
                    
                    const magnetDx = playerCenterX - enemyCenterX;
                    const magnetDy = playerCenterY - enemyCenterY;
                    const magnetLength = Math.sqrt(magnetDx * magnetDx + magnetDy * magnetDy);
                    
                    if (magnetLength > 0) {
                        // Extremely strong magnet when close
                        const magnetStrength = magnetLength < 100 ? 8.0 : 2.0;
                        dx = (magnetDx / magnetLength) * magnetStrength;
                        dy = (magnetDy / magnetLength) * magnetStrength;
                    }
                }
                
                const length = Math.sqrt(dx * dx + dy * dy);
                const dirX = length > 0 ? dx / length : 0;
                const dirY = length > 0 ? dy / length : 0;

                // Calculate new position
                const newX = enemy.x + dirX * teleporterEnemySpeed.current;
                const newY = enemy.y + dirY * teleporterEnemySpeed.current;
                
                // Check wall collision before moving
                let canMove = true;
                for (let wall of walls.current) {
                    if (newX + enemy.width > wall.x && newX < wall.x + wall.width &&
                        newY + enemy.height > wall.y && newY < wall.y + wall.height) {
                        canMove = false;
                        break;
                    }
                }
                
                // Only move if not colliding with walls
                if (canMove) {
                    enemy.x = newX;
                    enemy.y = newY;
                }
            }

            const enemyCenterX = enemy.x + enemy.width / 2;
            const enemyCenterY = enemy.y + enemy.height / 2;
            
            // Draw teleporter enemy with special effects
            ctx.save();
            
            // Calculate rotation towards player
            const playerCenterX = playerRef.current.x + playerRef.current.width / 2;
            const playerCenterY = playerRef.current.y + playerRef.current.height / 2;
            const rotationDx = playerCenterX - enemyCenterX;
            const rotationDy = playerCenterY - enemyCenterY;
            const teleporterRotationAngle = Math.atan2(rotationDy, rotationDx);
            
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
            
            // Apply rotation
            ctx.translate(enemyCenterX, enemyCenterY);
            ctx.rotate(teleporterRotationAngle);
            
            if (teleporterImageRef.current) {
                // Add cyan tint to distinguish from basic enemies
                ctx.filter = 'hue-rotate(180deg) saturate(1.5) brightness(1.1)';
                ctx.drawImage(
                    teleporterImageRef.current, 
                    -enemy.width / 2, 
                    -enemy.height / 2, 
                    enemy.width, 
                    enemy.height
                );
                ctx.filter = 'none';
            } else {
                ctx.fillStyle = enemy.teleporting ? "lightcyan" : enemy.color;
                ctx.fillRect(-enemy.width / 2, -enemy.height / 2, enemy.width, enemy.height);
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
        
        // Remove basic enemy bullets that are out of bounds or hit walls
        basicEnemyBulletsRef.current = basicEnemyBulletsRef.current.filter((bullet) => {
            // Check wall collision
            for (let wall of walls.current) {
                if (bullet.x + 10 > wall.x && bullet.x < wall.x + wall.width &&
                    bullet.y + 10 > wall.y && bullet.y < wall.y + wall.height) {
                    return false; // Remove bullet if it hits wall
                }
            }
            return bullet.x >= 0 && bullet.x <= window.innerWidth && bullet.y >= 0 && bullet.y <= window.innerHeight;
        });

        // Remove teleporter enemy bullets that are out of bounds or hit walls
        teleporterEnemyBulletsRef.current = teleporterEnemyBulletsRef.current.filter((bullet) => {
            // Check wall collision
            for (let wall of walls.current) {
                if (bullet.x + 10 > wall.x && bullet.x < wall.x + wall.width &&
                    bullet.y + 10 > wall.y && bullet.y < wall.y + wall.height) {
                    return false; // Remove bullet if it hits wall
                }
            }
            return bullet.x >= 0 && bullet.x <= window.innerWidth && bullet.y >= 0 && bullet.y <= window.innerHeight;
        });

        // Remove triple shoot enemy bullets that are out of bounds or hit walls
        trippleShootEnemyBulletsRef.current = trippleShootEnemyBulletsRef.current.filter((bullet) => {
            // Check wall collision
            for (let wall of walls.current) {
                if (bullet.x + 10 > wall.x && bullet.x < wall.x + wall.width &&
                    bullet.y + 10 > wall.y && bullet.y < wall.y + wall.height) {
                    return false; // Remove bullet if it hits wall
                }
            }
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
                    // Check shield protection
                    if (shieldAbilityActive.current && shieldHitsRemaining.current > 0) {
                        shieldHitsRemaining.current--;
                        if (shieldHitsRemaining.current <= 0) {
                            shieldAbilityActive.current = false;
                        }
                    } else {
                        looseRef.current = true;
                        setLoose(true);
                    }
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
                    
                    // Create kill effects
                    createKillEffect(enemyCenterX, enemyCenterY, 30);
                    
                    score.current += 30;
                    updateDifficulty(); // Balanced difficulty progression
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
                    // Check shield protection
                    if (shieldAbilityActive.current && shieldHitsRemaining.current > 0) {
                        shieldHitsRemaining.current--;
                        if (shieldHitsRemaining.current <= 0) {
                            shieldAbilityActive.current = false;
                        }
                    } else {
                        looseRef.current = true;
                        setLoose(true);
                    }
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
                // Only lose if not immortal or phase walking
                if (!immortalityAbilityActive.current && !phaseWalkActive.current) {
                    // Check shield protection
                    if (shieldAbilityActive.current && shieldHitsRemaining.current > 0) {
                        shieldHitsRemaining.current--;
                        if (shieldHitsRemaining.current <= 0) {
                            shieldAbilityActive.current = false;
                        }
                    } else {
                        looseRef.current = true;
                        setLoose(true);
                    }
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
                    // Check shield protection
                    if (shieldAbilityActive.current && shieldHitsRemaining.current > 0) {
                        shieldHitsRemaining.current--;
                        if (shieldHitsRemaining.current <= 0) {
                            shieldAbilityActive.current = false;
                        }
                    } else {
                        looseRef.current = true;
                        setLoose(true);
                    }
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
                    
                    // Create kill effects
                    createKillEffect(enemyHeadX, enemyHeadY, 10);
                    
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
                        
                        // Create kill effects
                        createKillEffect(enemyHeadX, enemyHeadY, 10);
                        
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
                        
                        // Create kill effects
                        createKillEffect(enemyCenterX, enemyCenterY, 15);
                        
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
                            
                            // Create kill effects
                            createKillEffect(enemyCenterX, enemyCenterY, 20);
                            
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
                            
                            // Create kill effects
                            createKillEffect(enemyCenterX, enemyCenterY, 25);
                            
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
                        
                        // Create kill effects
                        createKillEffect(enemyHeadX, enemyHeadY, 10);
                        
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
                        
                        // Create kill effects
                        createKillEffect(enemyCenterX, enemyCenterY, 15);
                        
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
                            
                            // Create kill effects
                            createKillEffect(enemyCenterX, enemyCenterY, 20);
                            
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
                            
                            // Create kill effects
                            createKillEffect(enemyCenterX, enemyCenterY, 25);
                            
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
                            
                            // Create kill effects
                            createKillEffect(enemyHeadX, enemyHeadY, 12);
                            
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
                            
                            // Create kill effects
                            createKillEffect(enemyCenterX, enemyCenterY, 18);
                            
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
                                
                                // Create kill effects
                                createKillEffect(enemyCenterX, enemyCenterY, 25);
                                
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
                                
                                // Create kill effects
                                createKillEffect(enemyCenterX, enemyCenterY, 30);
                                
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
                    // Check shield protection
                    if (shieldAbilityActive.current && shieldHitsRemaining.current > 0) {
                        shieldHitsRemaining.current--;
                        if (shieldHitsRemaining.current <= 0) {
                            shieldAbilityActive.current = false;
                        }
                    } else {
                        looseRef.current = true;
                        setLoose(true);
                    }
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
                    // Check shield protection
                    if (shieldAbilityActive.current && shieldHitsRemaining.current > 0) {
                        shieldHitsRemaining.current--;
                        if (shieldHitsRemaining.current <= 0) {
                            shieldAbilityActive.current = false;
                        }
                    } else {
                        looseRef.current = true;
                        setLoose(true);
                    }
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
                    // Check shield protection
                    if (shieldAbilityActive.current && shieldHitsRemaining.current > 0) {
                        shieldHitsRemaining.current--;
                        if (shieldHitsRemaining.current <= 0) {
                            shieldAbilityActive.current = false;
                        }
                    } else {
                        looseRef.current = true;
                        setLoose(true);
                    }
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
                    
                    // Create kill effects
                    createKillEffect(enemyCenterX, enemyCenterY, 25);
                    
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
                    
                    // Create kill effects
                    createKillEffect(enemyCenterX, enemyCenterY, 30);
                    
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

        // Soldier bullet collision detection with all enemy types
        soldierBullets.current.forEach((soldierBullet, sbIndex) => {
            const soldierBulletCenterX = soldierBullet.x + soldierBullet.width/2;
            const soldierBulletCenterY = soldierBullet.y + soldierBullet.height/2;
            
            // Collisions with basic enemies
            basicEnemyRef.current.forEach((enemy, eIndex) => {
                const enemyHeadX = enemy.x + enemy.width / 2;
                const enemyHeadY = enemy.y + enemy.height / 4;
                
                if (circularCollision(enemyHeadX, enemyHeadY, 40, soldierBulletCenterX, soldierBulletCenterY, 5)) {
                    soldierBullets.current.splice(sbIndex, 1);
                    basicEnemyRef.current.splice(eIndex, 1);
                    
                    // Create kill effects
                    createKillEffect(enemyHeadX, enemyHeadY, 10);
                    
                    score.current += 10;
                    difficulty.current += Math.floor(score.current / 100);
                }
            });
            
            // Collisions with triple shoot enemies
            trippleShootEnemyRef.current.forEach((enemy, eIndex) => {
                const enemyCenterX = enemy.x + enemy.width / 2;
                const enemyCenterY = enemy.y + enemy.height / 2;
                
                if (circularCollision(enemyCenterX, enemyCenterY, 15, soldierBulletCenterX, soldierBulletCenterY, 5)) {
                    soldierBullets.current.splice(sbIndex, 1);
                    trippleShootEnemyRef.current.splice(eIndex, 1);
                    
                    // Create kill effects
                    createKillEffect(enemyCenterX, enemyCenterY, 30);
                    
                    score.current += 30;
                    difficulty.current += Math.floor(score.current / 100);
                }
            });
            
            // Collisions with bomber enemies
            bomberEnemyRef.current.forEach((enemy, eIndex) => {
                const enemyCenterX = enemy.x + enemy.width / 2;
                const enemyCenterY = enemy.y + enemy.height / 2;
                
                if (circularCollision(enemyCenterX, enemyCenterY, 25, soldierBulletCenterX, soldierBulletCenterY, 5)) {
                    soldierBullets.current.splice(sbIndex, 1);
                    bomberEnemyRef.current.splice(eIndex, 1);
                    
                    // Create kill effects
                    createKillEffect(enemyCenterX, enemyCenterY, 25);
                    
                    score.current += 25;
                    difficulty.current += Math.floor(score.current / 100);
                }
            });
            
            // Collisions with teleporter enemies (only when not teleporting)
            teleporterEnemyRef.current.forEach((enemy, eIndex) => {
                if (enemy.teleporting) return; // Can't hit while teleporting
                
                const enemyCenterX = enemy.x + enemy.width / 2;
                const enemyCenterY = enemy.y + enemy.height / 2;
                
                if (circularCollision(enemyCenterX, enemyCenterY, 35, soldierBulletCenterX, soldierBulletCenterY, 5)) {
                    soldierBullets.current.splice(sbIndex, 1);
                    teleporterEnemyRef.current.splice(eIndex, 1);
                    
                    // Create kill effects
                    createKillEffect(enemyCenterX, enemyCenterY, 30);
                    
                    score.current += 30;
                    difficulty.current += Math.floor(score.current / 100);
                }
            });
        });

        // Soldier Ability bullet collision detection with all enemy types
        soldierAbilitySoldierBullets.current.forEach((soldierBullet, sbIndex) => {
            const soldierBulletCenterX = soldierBullet.x + soldierBullet.width/2;
            const soldierBulletCenterY = soldierBullet.y + soldierBullet.height/2;
            
            // Collisions with basic enemies
            basicEnemyRef.current.forEach((enemy, eIndex) => {
                const enemyHeadX = enemy.x + enemy.width / 2;
                const enemyHeadY = enemy.y + enemy.height / 4;
                
                if (circularCollision(enemyHeadX, enemyHeadY, 40, soldierBulletCenterX, soldierBulletCenterY, 5)) {
                    soldierAbilitySoldierBullets.current.splice(sbIndex, 1);
                    basicEnemyRef.current.splice(eIndex, 1);
                    
                    // Create kill effects
                    createKillEffect(enemyHeadX, enemyHeadY, 10);
                    
                    score.current += 10;
                    difficulty.current += Math.floor(score.current / 100);
                }
            });
            
            // Collisions with triple shoot enemies
            trippleShootEnemyRef.current.forEach((enemy, eIndex) => {
                const enemyCenterX = enemy.x + enemy.width / 2;
                const enemyCenterY = enemy.y + enemy.height / 2;
                
                if (circularCollision(enemyCenterX, enemyCenterY, 15, soldierBulletCenterX, soldierBulletCenterY, 5)) {
                    soldierAbilitySoldierBullets.current.splice(sbIndex, 1);
                    trippleShootEnemyRef.current.splice(eIndex, 1);
                    
                    // Create kill effects
                    createKillEffect(enemyCenterX, enemyCenterY, 30);
                    
                    score.current += 30;
                    difficulty.current += Math.floor(score.current / 100);
                }
            });
            
            // Collisions with bomber enemies
            bomberEnemyRef.current.forEach((enemy, eIndex) => {
                const enemyCenterX = enemy.x + enemy.width / 2;
                const enemyCenterY = enemy.y + enemy.height / 2;
                
                if (circularCollision(enemyCenterX, enemyCenterY, 25, soldierBulletCenterX, soldierBulletCenterY, 5)) {
                    soldierAbilitySoldierBullets.current.splice(sbIndex, 1);
                    bomberEnemyRef.current.splice(eIndex, 1);
                    
                    // Create kill effects
                    createKillEffect(enemyCenterX, enemyCenterY, 25);
                    
                    score.current += 25;
                    difficulty.current += Math.floor(score.current / 100);
                }
            });
            
            // Collisions with teleporter enemies (only when not teleporting)
            teleporterEnemyRef.current.forEach((enemy, eIndex) => {
                if (enemy.teleporting) return; // Can't hit while teleporting
                
                const enemyCenterX = enemy.x + enemy.width / 2;
                const enemyCenterY = enemy.y + enemy.height / 2;
                
                if (circularCollision(enemyCenterX, enemyCenterY, 35, soldierBulletCenterX, soldierBulletCenterY, 5)) {
                    soldierAbilitySoldierBullets.current.splice(sbIndex, 1);
                    teleporterEnemyRef.current.splice(eIndex, 1);
                    
                    // Create kill effects
                    createKillEffect(enemyCenterX, enemyCenterY, 30);
                    
                    score.current += 30;
                    difficulty.current += Math.floor(score.current / 100);
                }
            });
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

// TIER SYSTEM INDICATORS
const playerScore = score.current;
let tierText = "Tier 1: Basic Enemies";
let tierColor = "#4CAF50"; // Green

if (playerScore >= TIER_3_THRESHOLD) {
    tierText = "Tier 3: All Enemies Active!";
    tierColor = "#F44336"; // Red
} else if (playerScore >= TIER_2_THRESHOLD) {
    tierText = "Tier 2: Advanced Enemies";
    tierColor = "#FF9800"; // Orange
}

// Display current tier
ctx.fillStyle = tierColor;
ctx.fillText(tierText, textMarginX, textMarginY + (fontSize * 3));

// Display next tier info
ctx.fillStyle = "white";
if (playerScore < TIER_2_THRESHOLD) {
    const remaining = TIER_2_THRESHOLD - playerScore;
    ctx.fillText(`Next: ${remaining} points to Tier 2`, textMarginX, textMarginY + (fontSize * 4.5));
} else if (playerScore < TIER_3_THRESHOLD) {
    const remaining = TIER_3_THRESHOLD - playerScore;
    ctx.fillText(`Next: ${remaining} points to Tier 3`, textMarginX, textMarginY + (fontSize * 4.5));
} else {
    ctx.fillText("Maximum Tier Reached!", textMarginX, textMarginY + (fontSize * 4.5));
}

// Draw tier unlock notifications
tierNotifications.current = tierNotifications.current.filter(notification => {
    const elapsed = currentTime - notification.startTime;
    if (elapsed > notification.duration) {
        return false; // Remove expired notifications
    }
    
    // Calculate fade effect
    const fadeProgress = elapsed / notification.duration;
    const alpha = fadeProgress < 0.8 ? 1 : (1 - (fadeProgress - 0.8) / 0.2);
    
    // Position notification in center of screen
    const notifX = window.innerWidth / 2;
    const notifY = window.innerHeight / 2 - 100;
    
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.textAlign = 'center';
    ctx.font = `bold ${fontSize * 1.5}px 'MedievalSharp', cursive`;
    
    // Add glow effect
    ctx.shadowColor = notification.color;
    ctx.shadowBlur = 20;
    ctx.fillStyle = notification.color;
    ctx.fillText(notification.text, notifX, notifY);
    
    // White outline for better visibility
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.strokeText(notification.text, notifX, notifY);
    
    ctx.restore();
    
    return true; // Keep notification
});


       

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
            const cooldownToUse = reloadAbilityActive.current ? SLASH_COOLDOWN_BOOSTED : SLASH_COOLDOWN;
            // Ensure progress never exceeds 1.0 and handle negative values
            const progress = Math.max(0, Math.min(elapsed / cooldownToUse, 1));

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
            const cooldownToUse = reloadAbilityActive.current ? ARROW_COOLDOWN_BOOSTED : ARROW_COOLDOWN;
            // Ensure progress never exceeds 1.0 and handle negative values
            const progress = Math.max(0, Math.min(elapsed / cooldownToUse, 1));

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
            const cooldownToUse = reloadAbilityActive.current ? SPELL_COOLDOWN_BOOSTED : SPELL_COOLDOWN;
            // Ensure progress never exceeds 1.0 and handle negative values
            const progress = Math.max(0, Math.min(elapsed / cooldownToUse, 1));

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
        } else if (currentCharacter.combatType === 'soldiers' && !canSpawnSoldier.current) {
            // King soldier spawn cooldown
            const elapsed = currentTime - lastSoldierSpawnTime.current;
            const cooldownToUse = reloadAbilityActive.current ? KING_SOLDIER_COOLDOWN_BOOSTED : KING_SOLDIER_COOLDOWN;
            // Ensure progress never exceeds 1.0 and handle negative values
            const progress = Math.max(0, Math.min(elapsed / cooldownToUse, 1));

            const barWidth = 20;
            const barHeight = 100;
            const barX = playerCenterX - 100;
            const barY = playerCenterY - 40;

            ctx.save();

            ctx.fillStyle = "black";
            drawRoundedRect(ctx, barX, barY, barWidth, barHeight, 5);
            ctx.fill();

            ctx.clip();

            ctx.fillStyle = "blue"; // Blue for soldier spawn cooldown
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
                    case 'soldierHelp':
                        abilityRef = soldierAbilityRef.current; // Use soldier ability icon
                        isOnCooldown = soldierAbilityOnCooldown.current;
                        cooldownStartTime = soldierAbilityCooldownStartTime.current;
                        cooldownDuration = SOLDIER_ABILITY_COOLDOWN;
                        abilityName = 'T';
                        break;
                    case 'scoreboost':
                        abilityRef = scoreBoostAbilityRef.current; // Use specific score boost icon
                        isOnCooldown = scoreBoostAbilityOnCooldown.current;
                        cooldownStartTime = scoreBoostAbilityCooldownStartTime.current;
                        cooldownDuration = SCOREBOOST_COOLDOWN;
                        abilityName = 'T';
                        break;
                    case 'freeze':
                        abilityRef = freezeAbilityRef.current;
                        isOnCooldown = freezeAbilityOnCooldown.current;
                        cooldownStartTime = freezeAbilityCooldownStartTime.current;
                        cooldownDuration = FREEZE_COOLDOWN;
                        abilityName = 'R';
                        break;
                    case 'lightningstorm':
                        abilityRef = lightningStormAbilityRef.current;
                        isOnCooldown = lightningStormAbilityOnCooldown.current;
                        cooldownStartTime = lightningStormAbilityCooldownStartTime.current;
                        cooldownDuration = LIGHTNING_STORM_COOLDOWN;
                        abilityName = 'R';
                        break;
                    case 'poisoncloud':
                        abilityRef = poisonCloudAbilityRef.current;
                        isOnCooldown = poisonCloudAbilityOnCooldown.current;
                        cooldownStartTime = poisonCloudAbilityCooldownStartTime.current;
                        cooldownDuration = POISON_CLOUD_COOLDOWN;
                        abilityName = 'R';
                        break;
                    case 'meteor':
                        abilityRef = meteorAbilityRef.current;
                        isOnCooldown = meteorAbilityOnCooldown.current;
                        cooldownStartTime = meteorAbilityCooldownStartTime.current;
                        cooldownDuration = METEOR_COOLDOWN;
                        abilityName = 'R';
                        break;
                    case 'shield':
                        abilityRef = shieldAbilityRef.current;
                        isOnCooldown = shieldAbilityOnCooldown.current;
                        cooldownStartTime = shieldAbilityCooldownStartTime.current;
                        cooldownDuration = SHIELD_COOLDOWN;
                        abilityName = 'F';
                        break;
                    case 'dash':
                        abilityRef = dashAbilityRef.current;
                        isOnCooldown = dashAbilityOnCooldown.current;
                        cooldownStartTime = dashAbilityCooldownStartTime.current;
                        cooldownDuration = DASH_COOLDOWN;
                        abilityName = 'F';
                        break;
                    case 'wallcreation':
                        abilityRef = wallCreationAbilityRef.current;
                        isOnCooldown = wallCreationAbilityOnCooldown.current;
                        cooldownStartTime = wallCreationAbilityCooldownStartTime.current;
                        cooldownDuration = WALL_CREATION_COOLDOWN;
                        abilityName = 'T';
                        break;
                    case 'magnet':
                        abilityRef = magnetAbilityRef.current;
                        isOnCooldown = magnetAbilityOnCooldown.current;
                        cooldownStartTime = magnetAbilityCooldownStartTime.current;
                        cooldownDuration = MAGNET_COOLDOWN;
                        abilityName = 'T';
                        break;
                    case 'mirrorclone':
                        abilityRef = mirrorCloneAbilityRef.current;
                        isOnCooldown = mirrorCloneAbilityOnCooldown.current;
                        cooldownStartTime = mirrorCloneAbilityCooldownStartTime.current;
                        cooldownDuration = MIRROR_CLONE_COOLDOWN;
                        abilityName = 'T';
                        break;
                    case 'berserkermode':
                        abilityRef = berserkerModeAbilityRef.current;
                        isOnCooldown = berserkerModeAbilityOnCooldown.current;
                        cooldownStartTime = berserkerModeAbilityCooldownStartTime.current;
                        cooldownDuration = BERSERKER_MODE_COOLDOWN;
                        abilityName = 'F';
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

        // Draw kill effects (particles and floating text)
        updateAndDrawEffects(ctx);

        if (!looseRef.current){
            animationFrameId = requestAnimationFrame(gameLoop);

        }
        else {
            // Only give rewards once when the game ends
            if (!rewardsGivenRef.current) {
                const goldToAdd = Math.floor(score.current / 10);
                const expToAdd = Math.floor(score.current / 30);
                console.log('Game ended! Score:', score.current);
                console.log('Gold to add:', goldToAdd);
                console.log('Exp to add:', expToAdd);
                
                // Add rewards and reload data for UI update - FIXED SEQUENTIAL APPROACH
                const giveRewards = async () => {
                  try {
                    console.log('🎁 === REWARD GIVING START ===');
                    
                    // SEQUENTIAL saving to prevent race conditions
                    console.log('🎁 Step 1: Adding gold...');
                    await addGold(goldToAdd);
                    console.log('🎁 Step 1 completed: Gold saved to database');
                    
                    console.log('🎁 Step 2: Adding exp...');
                    await addExp(expToAdd);
                    console.log('🎁 Step 2 completed: Exp saved to database');
                    
                    console.log('🎁 Step 3: Waiting for database operations to settle...');
                    // Small delay to ensure database operations are fully committed
                    await new Promise(resolve => setTimeout(resolve, 100));
                    
                    // Reload data after rewards are saved to database
                    if (reloadGameData) {
                      console.log('🎁 Step 4: Reloading fresh game data from database...');
                      await reloadGameData();
                      console.log('🎁 Step 4 completed: Fresh data loaded from database');
                    }
                    
                    console.log('🎁 === REWARD GIVING COMPLETED SUCCESSFULLY ===');
                  } catch (error) {
                    console.error('🎁 === REWARD GIVING ERROR ===');
                    console.error('🎁 Error giving rewards:', error);
                  }
                };
                
                giveRewards(); // Call the async function
                rewardsGivenRef.current = true; // Mark rewards as given
            }
        }
    }


    gameLoop();

    return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
    };

    },[isLoading]);;
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

    

    // Show loading screen while game initializes
    if (isLoading) {
        return <LoadingScreen progress={progress} message={message} />;
    }

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
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
                <p>+exp: {score.current / 30}</p>
                <p>+gold: {score.current / 10}</p>
                <Link to="/loadout"> Back</Link>
            </div>
        )}
        </div>
    );
}