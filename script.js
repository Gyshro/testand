class PixelGame {
    constructor() {
        this.currentScene = 'wake_up';
        this.dialogIndex = 0;
        this.isDialogActive = false;
        this.isAnimating = false;
        this.canMove = false;
        
        // Joystick properties
        this.joystick = {
            active: false,
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            maxDistance: 25
        };
        
        // Character movement
        this.characterPosition = { x: 50, y: 50 }; // Posição inicial central para top-down
        this.moveSpeed = 0.5; // Velocidade de movimento ajustada para fluidez
        
        // Game elements
        this.character = document.getElementById('character');
        this.background = document.getElementById('background');
        this.window = document.getElementById('window');
        this.table = document.getElementById('table');
        this.bed = document.getElementById('bed');
        this.chair = document.getElementById('chair');
        this.dialogBox = document.getElementById('dialog-box');
        this.dialogText = document.getElementById('dialog-text');
        this.instructionBox = document.getElementById('instruction-box');
        this.instructionText = document.getElementById('instruction-text');
        this.arrow = document.getElementById('arrow');
        this.dreamButton = document.getElementById('dream-button');
        this.dreamScreen = document.getElementById('dream-screen');
        this.dreamText = document.getElementById('dream-text');
        this.transitionScreen = document.getElementById('transition-screen');
        this.joystickContainer = document.getElementById('joystick-container');
        this.joystickBase = document.getElementById('joystick-base');
        this.joystickKnob = document.getElementById('joystick-knob');
        this.dreamMusic = document.getElementById('dream-music');
        
        // Position elements
        this.setupInitialPositions();
        
        // Bind events
        this.bindEvents();
        
        // Start game
        this.startGame();
    }
    
    setupInitialPositions() {
        // Posições ajustadas para top-down
        this.characterPosition = { x: 50, y: 50 }; // Personagem começa no centro
        this.updateCharacterPosition();
        
        // Exemplo de posicionamento de elementos para top-down
        this.bed.style.left = '10%';
        this.bed.style.top = '30%';
        
        this.window.style.left = '70%';
        this.window.style.top = '10%';
        
        this.table.style.left = '40%';
        this.table.style.top = '60%';

        this.chair.style.left = '55%'; // Cadeira à direita da mesa
        this.chair.style.top = '65%';
    }
    
    updateCharacterPosition() {
        this.character.style.left = this.characterPosition.x + '%';
        this.character.style.top = this.characterPosition.y + '%';
    }
    
    bindEvents() {
        // Touch/click events for mobile
        document.addEventListener('touchstart', (e) => this.handleTouch(e));
        document.addEventListener('click', (e) => this.handleClick(e));
        
        // Joystick events
        this.joystickBase.addEventListener('touchstart', (e) => this.startJoystick(e));
        this.joystickBase.addEventListener('touchmove', (e) => this.moveJoystick(e));
        this.joystickBase.addEventListener('touchend', (e) => this.endJoystick(e));
        
        // Mouse events for desktop testing
        this.joystickBase.addEventListener('mousedown', (e) => this.startJoystick(e));
        document.addEventListener('mousemove', (e) => this.moveJoystick(e));
        document.addEventListener('mouseup', (e) => this.endJoystick(e));
        
        // Dream button
        document.getElementById('see-dream-btn').addEventListener('click', () => {
            this.startDream();
        });
        
        // Movement update loop
        this.gameLoop();
    }
    
    startJoystick(e) {
        if (!this.canMove) return;
        
        e.preventDefault();
        this.joystick.active = true;
        
        const rect = this.joystickBase.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        this.joystick.startX = centerX;
        this.joystick.startY = centerY;
    }
    
    moveJoystick(e) {
        if (!this.joystick.active || !this.canMove) return;
        
        e.preventDefault();
        
        let clientX, clientY;
        if (e.touches && e.touches[0]) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        const deltaX = clientX - this.joystick.startX;
        const deltaY = clientY - this.joystick.startY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance <= this.joystick.maxDistance) {
            this.joystick.currentX = deltaX;
            this.joystick.currentY = deltaY;
        } else {
            const angle = Math.atan2(deltaY, deltaX);
            this.joystick.currentX = Math.cos(angle) * this.joystick.maxDistance;
            this.joystick.currentY = Math.sin(angle) * this.joystick.maxDistance;
        }
        
        // Update knob position
        this.joystickKnob.style.transform = `translate(calc(-50% + ${this.joystick.currentX}px), calc(-50% + ${this.joystick.currentY}px))`;
        
        // Move character
        this.moveCharacter();
    }
    
    endJoystick(e) {
        if (!this.joystick.active) return;
        
        e.preventDefault();
        this.joystick.active = false;
        this.joystick.currentX = 0;
        this.joystick.currentY = 0;
        
        // Reset knob position
        this.joystickKnob.style.transform = 'translate(-50%, -50%)';
        
        // Stop character animation
        this.character.classList.remove('walking');
    }
    
    moveCharacter() {
        if (!this.canMove || this.isAnimating) return;
        
        const moveX = (this.joystick.currentX / this.joystick.maxDistance) * this.moveSpeed;
        const moveY = (this.joystick.currentY / this.joystick.maxDistance) * this.moveSpeed;
        
        // Update character position with boundaries
        this.characterPosition.x = Math.max(0, Math.min(100, this.characterPosition.x + moveX));
        this.characterPosition.y = Math.max(0, Math.min(100, this.characterPosition.y + moveY));
        
        this.updateCharacterPosition();
        
        // Add walking animation if moving
        if (Math.abs(moveX) > 0.01 || Math.abs(moveY) > 0.01) {
            this.character.classList.add('walking');
        } else {
            this.character.classList.remove('walking');
        }
        
        // Check for interactions
        this.checkInteractions();
    }
    
    checkInteractions() {
        const charRect = this.character.getBoundingClientRect();
        const windowRect = this.window.getBoundingClientRect();
        const tableRect = this.table.getBoundingClientRect();
        const bedRect = this.bed.getBoundingClientRect();
        const chairRect = this.chair.getBoundingClientRect();
        
        // Aumentar a área de interação para top-down
        const interactionThreshold = 80; // Ajuste conforme necessário

        // Check window interaction
        if (this.currentScene === 'at_window' && this.isNear(charRect, windowRect, interactionThreshold)) {
            this.openCurtain();
        }
        
        // Check table interaction
        if (this.currentScene === 'study_time' && this.isNear(charRect, tableRect, interactionThreshold)) {
            this.goToTable();
        }
        
        // Check bed interaction
        if (this.currentScene === 'going_to_sleep' && this.isNear(charRect, bedRect, interactionThreshold)) {
            this.goToBed();
        }

        // Check chair interaction (se a personagem estiver perto da cadeira e da mesa)
        if (this.currentScene === 'study_time' && this.isNear(charRect, chairRect, interactionThreshold) && this.isNear(charRect, tableRect, interactionThreshold)) {
            // Lógica para sentar na cadeira
            // this.character.classList.add('sitting'); // Isso será feito em goToTable
        }
    }
    
    isNear(rect1, rect2, threshold) {
        const centerX1 = rect1.left + rect1.width / 2;
        const centerY1 = rect1.top + rect1.height / 2;
        const centerX2 = rect2.left + rect2.width / 2;
        const centerY2 = rect2.top + rect2.height / 2;
        
        const distance = Math.sqrt(
            Math.pow(centerX1 - centerX2, 2) + Math.pow(centerY1 - centerY2, 2)
        );
        
        return distance < threshold;
    }
    
    gameLoop() {
        // Game update loop
        requestAnimationFrame(() => this.gameLoop());
    }
    
    handleTouch(e) {
        if (this.isDialogActive) {
            this.nextDialog();
        } else if (!this.canMove && this.currentScene === 'wake_up') {
            this.enableMovement();
        }
    }
    
    handleClick(e) {
        if (this.isDialogActive) {
            this.nextDialog();
        } else if (!this.canMove && this.currentScene === 'wake_up') {
            this.enableMovement();
        }
    }
    
    startGame() {
        this.showInstruction('Toque na tela para começar');
        this.currentScene = 'wake_up';
        this.character.classList.add('sleeping'); // Personagem começa deitada
    }
    
    enableMovement() {
        this.hideInstruction();
        this.canMove = true;
        this.joystickContainer.classList.remove('hidden');
        this.currentScene = 'at_window';
        this.showInstruction('Use o joystick para andar até a janela');
        this.character.classList.remove('sleeping'); // Personagem acorda
    }
    
    openCurtain() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        this.hideInstruction();
        this.canMove = false;
        this.joystickContainer.classList.add('hidden');
        this.character.classList.add('opening-curtain');
        
        setTimeout(() => {
            this.window.classList.add('open');
            this.character.classList.remove('opening-curtain');
            this.currentScene = 'curtain_opened';
            this.isAnimating = false;
            this.showDialog('Eita que dia bom, eu só queria um açaí agora');
        }, 800);
    }
    
    nextDialog() {
        if (this.currentScene === 'curtain_opened') {
            this.showDialog('Cahfofocofocofcah... poura minha garganta tá ruim D:');
            this.currentScene = 'tea_time';
        } else if (this.currentScene === 'tea_time') {
            this.character.classList.add('holding-tea');
            setTimeout(() => {
                this.character.classList.remove('holding-tea');
                this.character.classList.add('drinking-tea');
                this.showDialog('*tomando chá igual um pato*');
                setTimeout(() => {
                    this.hideDialog();
                    this.character.classList.remove('drinking-tea');
                    this.showArrowToTable();
                    this.currentScene = 'study_time';
                    this.canMove = true;
                    this.joystickContainer.classList.remove('hidden');
                    this.showInstruction('Use o joystick para ir até a mesa');
                }, 2000);
            }, 500);
        } else if (this.currentScene === 'night_tired') {
            this.hideDialog();
            this.currentScene = 'going_to_sleep';
            this.canMove = true;
            this.joystickContainer.classList.remove('hidden');
            this.showInstruction('Use o joystick para ir até a cama');
        }
    }
    
    showArrowToTable() {
        const tableRect = this.table.getBoundingClientRect();
        const gameRect = document.getElementById('game-screen').getBoundingClientRect();
        
        this.arrow.style.left = (tableRect.left - gameRect.left + tableRect.width/2 - 15) + 'px';
        this.arrow.style.top = (tableRect.top - gameRect.top - 40) + 'px';
        this.arrow.classList.remove('hidden');
    }
    
    goToTable() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        this.arrow.classList.add('hidden');
        this.hideInstruction();
        this.canMove = false;
        this.joystickContainer.classList.add('hidden');
        this.character.classList.add('sitting');
        this.currentScene = 'studying';
        
        setTimeout(() => {
            this.isAnimating = false;
            this.showDialog('*estudando*');
            
            setTimeout(() => {
                this.hideDialog();
                this.transitionToNight();
            }, 2000);
        }, 1000);
    }
    
    transitionToNight() {
        this.isAnimating = true;
        
        // Show transition screen
        this.transitionScreen.classList.remove('hidden');
        this.transitionScreen.classList.add('active');
        
        setTimeout(() => {
            // Change to night background
            this.background.classList.add('night');
            this.transitionScreen.classList.remove('active');
            
            setTimeout(() => {
                this.transitionScreen.classList.add('hidden');
                this.character.classList.remove('sitting'); // Remove sitting class
                this.currentScene = 'night_tired';
                this.isAnimating = false;
                this.showDialog('Nossa, que sonim... acho que vou capotar porque ninguém é de ferro né.');
            }, 500);
        }, 1000);
    }
    
    goToBed() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        this.hideInstruction();
        this.canMove = false;
        this.joystickContainer.classList.add('hidden');
        this.character.classList.add('sleeping');
        
        // Move character to bed position (ajustar para top-down)
        this.characterPosition = { x: 15, y: 35 }; // Posição da cama
        this.updateCharacterPosition();
        
        setTimeout(() => {
            this.isAnimating = false;
            
            // Show dream button after a delay
            setTimeout(() => {
                this.dreamButton.classList.remove('hidden');
            }, 1500);
        }, 1000);
    }
    
    startDream() {
        this.dreamButton.classList.add('hidden');
        this.dreamScreen.classList.remove('hidden');
        
        // Start dream music
        this.dreamMusic.play().catch(e => console.log('Audio play failed:', e));
        
        // Add daisy field background after some time
        setTimeout(() => {
            this.dreamScreen.style.backgroundImage = 'url("assets/daisy_field.png"), url("assets/sky_clouds.png")';
            this.dreamScreen.style.backgroundSize = 'cover, cover';
            this.dreamScreen.style.backgroundPosition = 'bottom, center';
            this.dreamScreen.style.backgroundRepeat = 'no-repeat, no-repeat';
        }, 2000);
        
        // Start typing dream text
        this.typeDreamText();
    }
    
    typeDreamText() {
        const dreamTexts = [
            "Em um mundo de sonhos e possibilidades...",
            "Onde cada momento é uma nova descoberta...",
            "E a felicidade floresce como margaridas no campo...",
            "Você encontra a paz que sempre procurou...",
            "Nos pequenos momentos da vida..."
        ];
        
        let currentTextIndex = 0;
        
        const typeNextText = () => {
            if (currentTextIndex >= dreamTexts.length) {
                // End dream sequence
                setTimeout(() => {
                    this.dreamMusic.pause();
                    this.dreamMusic.currentTime = 0;
                    this.dreamScreen.classList.add('hidden');
                    this.showDialog('Que diabo de sonho foi esse... a vo volta a dormir isso sim');
                }, 3000);
                return;
            }
            
            const text = dreamTexts[currentTextIndex];
            this.dreamText.textContent = '';
            
            let charIndex = 0;
            const typeChar = () => {
                if (charIndex < text.length) {
                    this.dreamText.textContent += text[charIndex];
                    charIndex++;
                    setTimeout(typeChar, 100);
                } else {
                    currentTextIndex++;
                    setTimeout(() => {
                        if (currentTextIndex < dreamTexts.length) {
                            typeNextText();
                        } else {
                            // End dream sequence
                            setTimeout(() => {
                                this.dreamMusic.pause();
                                this.dreamMusic.currentTime = 0;
                                this.dreamScreen.classList.add('hidden');
                                this.showDialog('Que sonho mais lindo... Agora é hora de acordar para um novo dia!');
                            }, 3000);
                        }
                    }, 2000);
                }
            };
            
            typeChar();
        };
        
        // Start typing after a delay
        setTimeout(typeNextText, 1000);
    }
    
    showDialog(text) {
        this.dialogText.textContent = text;
        this.dialogBox.classList.remove('hidden');
        this.dialogBox.classList.add('slide-up');
        this.isDialogActive = true;
    }
    
    hideDialog() {
        this.dialogBox.classList.add('hidden');
        this.isDialogActive = false;
    }
    
    showInstruction(text) {
        this.instructionText.textContent = text;
        this.instructionBox.classList.remove('hidden');
        this.instructionBox.classList.add('fade-in');
    }
    
    hideInstruction() {
        this.instructionBox.classList.add('hidden');
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new PixelGame();
});

// Prevent zoom on double tap (iOS Safari)
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Prevent context menu on long press
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Lock orientation to portrait (if supported)
if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock('portrait').catch(() => {
        // Orientation lock not supported or failed
    });
}

