# Rastreamento Solar

Basicamente vamos precisar de 2 motores, um para girar igual um prato de micro-ondas, outro para virar para cima e para baixo, isso ja nos permite ter 100% da movimentação necessária para apontar para o sol

## 1. Ângulos de Saída

Já que vamos ter 2 motores, vamos ter que controlar os ângulos de cada um, vamos chamar cada um deles:

- O primeiro(analogia do micro-ondas): **Ângulo de Azimute** 

- O segundo: **Ângulo de Elevação($\alpha$)**

Com isso definido bora pra conta

---

### Ângulo de Elevação($\alpha$)

Já apresentado, é o Ângulo que define o quão inclinado vai estar, variando de:

**0°**(horizontal, paralelo ao solo) a 

**90°**(apontando 100% pra cima)

### Ângulo de Azimute

A rotação dele, medida em **360°**, visto que ele pode dar uma volta completa



> Agora que sabemos quais são as movimentações possiveis, precisamos saber como definir esses ângulos

---

## Variáveis de Entrada

Temos 3 Variáveis importântes aqui:

- Latitude

- Declinação

- Ângulo Horário

Explicando cada uma delas:

- **Latitude**($\phi$) provavelmente a mais fácil:
  
  É a variavel que define geograficamente o quão perto dos polos você está, variando de **-90°**(ponto mais sul do mundo, na Ântartica) e **90°**(ponto mais norte do mundo)
  
  > Sorocaba está no **$-26.51°$**
  
  Importante ressaltar que embora seria recomendado usarmos um modulo de GPS para detectar automaticamente a Latitude de usuario e deixar a captação de luz solar mais eficiênte, um módulo de GPS é caro e no prototipo usaremos o valor de sorocaba Hard-Coded

- **Delinação**($\delta$):
  
  A terra muda a angulação com base na epoca do ano, esse inclusive é o motivo de existir as **Estações do ano**
  
  A declinação serve simplesmente para saber o quanto esse angulo é, e na pratica, essa variavel varia em graus de acordo com os dias(**1** até **365**)

- **Ângulo Horário**($HRA$):
  
  Essa váriavel é o quanto a terra girou desde o meio dia, mudando **15°** por hora variando de **-180°**(meia noite) até 180°, para calcular o Ângulo Horario($Hora*15$) o horario precisa estar no formato 12 horas
  
  > Como essa é um pouco mais confusa, aqui vai alguns exemplos:
  > 
  > 1. 00:00
  >    
  >    Como **faltam** 12 horas até o meio dia, fazemos a conta:
  >    
  >    $-12*15 = -180°$ (deixando claro que o 12 é negativo por que **FALTAM** 12 horas)
  >    
  >    
  > 
  > 2. 15:00
  >    
  >    Como se **passaram** 3 horas desde o meio dia,
  >    
  >    fazemos a conta:
  >    
  >    $3*15 = 45°$ (**PASSARAM** 3 horas -> positivo)



## Fórmulas

### Latitude

Bom, latitude não tem uma fórmula, ela é apenas um valor obtivo por um GPS ou aparelho que tenha acesso a geolocalização, então vamos para o próximo



### Declinação($\delta$)

$$
\delta = 23.45^\circ \cdot \sin\left(\frac{360}{365} \cdot (d - 81)\right)
$$

explicação da formula:

- A Declinação Solar($\delta$) é medida em graus

- **23.45**: é uma constante, que representa o quanto a terra é inclinada

- $\frac{360}{365}$ : Temos 2 valores aqui, vamos dividir essa em 2 partes:
  
  - 360: Representa 360 graus, ou uma volta completa da terra
  
  - 365: Representa quantos dias tem um ano
    
    Isso tambem é uma constante e tem o valor aproximado de **0.986**, mas é muito mais fácil decorar $\frac{360}{365}$

- **d**: A única não constante que temos, representa o dia do ano(1-365)

- **81**: Esse valor tambem é uma constante e representa o dia **21 de março**, que é o Equinócio de Outono do Hemisferio sul, em outras palavras é quando o sol está exatamente sobre a linha do equador (declinação 0°)



###### AQUI ENTRA OS BIG PLAYERS

###### (VARIAVEIS DE ÂNGULO QUE DEFINEM A ANGULAÇÃO DOS MOTORES)



### Ângulo de Elevação($\alpha$)

É a altura do sol em relação ao horizonte medido em graus

$$
\alpha = \arcsin(\sin(\delta) \cdot \sin(\phi) + \cos(\delta) \cdot \cos(\phi) \cdot \cos(HRA))
$$

explicação da formula:

- **$\alpha$**: Medida em graus,

- **arcsin**: é o $\sin^{-1}$ que vemos na calculadora

- as outras variaveis já conhecemos:
  
  - $\delta$: declinação
  
  - $\phi$: latitude
  
  - $HRA$: Ângulo Horário

Na pratica:

- $\alpha = 0°$: nascer/pôr do sol

- $\alpha = 90°$: Equivalente ao 12:00, é quando ele está exatamente em cima da placa

**Contra intuição**:

- Depois dos 12:00, o ângulo não continua subindo, na verdade ele volta a descer até 0° de novo(meia noite)



### Ângulo de Azimute(A)

Reponsável por calcular a rotação horizontal,

$$
A' = \arccos\left(\frac{\sin(\delta) - \sin(\alpha) \cdot \sin(\phi)}{\cos(\alpha) \cdot \cos(\phi)}\right)
$$

Lembra que o $HRA$ varia de $-180°$ até $180°$, sendo 12:00 = $0°$? então, vamos precisar dele aqui

Caso $HRA<0$(Entre 00:00 e 12:00):

  O Ângulo de Azimute($A$) é o valor de $A'$ da fórmula

Caso contrario($HRA>0$):

  O Ângulo de Azimute($A$) é o valor de $360°-A'$



explicação da formula:

- $A'$: É o Ângulo Intermediário
  
  - `qual é a diferença dele para o Ângulo de Azimute, porém ele não sabe dizer se o sol está nascendo ou se pondo, por isso fazemos aqui que fizemos ali em cima usando o 'HRA'`

- as outras variáveis já conhecemos:
  
  * $\delta$: declinação
  
  * $\phi$: latitude
  
  * $\alpha$: Ângulo de Inclinação


