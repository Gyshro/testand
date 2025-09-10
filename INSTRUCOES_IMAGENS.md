# Instruções para Inserir Suas Imagens no Jogo

## Como Adicionar Suas Imagens

### 1. Estrutura de Pastas
Crie uma pasta chamada `assets` no mesmo diretório do jogo e coloque suas imagens lá.

### 2. Imagens Necessárias

#### Personagem (todas em pixel art, fundo transparente):
- `character_awake.png` - Personagem acordada (padrão)
- `character_walking.png` - Personagem andando (animação)
- `character_opening_curtain.png` - Personagem abrindo cortina
- `character_holding_tea.png` - Personagem segurando chá
- `character_drinking_tea.png` - Personagem bebendo chá
- `character_sitting.png` - Personagem sentada na cadeira
- `character_sleeping.png` - Personagem dormindo na cama

#### Cenários:
- `room_day.png` - Fundo do quarto durante o dia
- `room_night.png` - Fundo do quarto durante a noite
- `sky_clouds.png` - Céu com nuvens para o sonho
- `daisy_field.png` - Campo de margaridas para o sonho

#### Objetos (todos em pixel art, fundo transparente):
- `bed.png` - Cama
- `window_closed.png` - Janela fechada
- `window_open.png` - Janela aberta (cortina aberta)
- `table.png` - Mesa de estudos
- `chair.png` - Cadeira (posicionada à direita)

#### Áudio:
- `dream_music.mp3` - Música para a sequência do sonho

### 3. Como Aplicar as Imagens no CSS

Abra o arquivo `style.css` e adicione as seguintes linhas:

```css
/* Fundo do quarto */
#background {
    background-image: url('assets/room_day.png');
}

#background.night {
    background-image: url('assets/room_night.png');
}

/* Personagem */
#character {
    background-image: url('assets/character_awake.png');
}

#character.walking {
    background-image: url('assets/character_walking.png');
}

#character.opening-curtain {
    background-image: url('assets/character_opening_curtain.png');
}

#character.holding-tea {
    background-image: url('assets/character_holding_tea.png');
}

#character.drinking-tea {
    background-image: url('assets/character_drinking_tea.png');
}

#character.sitting {
    background-image: url('assets/character_sitting.png');
}

#character.sleeping {
    background-image: url('assets/character_sleeping.png');
}

/* Objetos */
#bed {
    background-image: url('assets/bed.png');
}

#window {
    background-image: url('assets/window_closed.png');
}

#window.open {
    background-image: url('assets/window_open.png');
}

#table {
    background-image: url('assets/table.png');
}

#chair {
    background-image: url('assets/chair.png');
}

/* Sonho */
#dream-background {
    background-image: url('assets/sky_clouds.png');
}

#dream-character {
    background-image: url('assets/character_sitting.png');
}
```

### 4. Dicas Importantes

- **Tamanho das imagens**: Recomendo usar imagens pequenas (64x64px para personagem, 128x128px para objetos)
- **Formato**: PNG com fundo transparente para personagem e objetos
- **Estilo**: Pixel art para manter a estética do jogo
- **Layout**: O jogo está configurado para perspectiva top-down (visão de cima)

### 5. Posicionamento dos Elementos

Os elementos estão posicionados da seguinte forma:
- **Cama**: Lado esquerdo (10% left, 30% top)
- **Janela**: Parte superior direita (70% left, 10% top)
- **Mesa**: Centro-direita (40% left, 60% top)
- **Cadeira**: À direita da mesa (55% left, 65% top)

Você pode ajustar essas posições no arquivo `style.css` se necessário.

### 6. Testando o Jogo

Após adicionar suas imagens, abra o arquivo `index.html` no navegador para testar. O jogo deve funcionar perfeitamente com suas imagens personalizadas!

### 7. Movimento Fluido

O movimento da personagem foi otimizado para ser mais fluido:
- Velocidade de movimento ajustada para 0.5
- Transição CSS de 0.1s linear
- Joystick responsivo para mobile
- Animações suaves entre estados

Divirta-se criando seu jogo personalizado! 🎮

