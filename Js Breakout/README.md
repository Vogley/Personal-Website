Hey
Here's a Breakout game, with a special little something.
Game goes to level 10.
Level 1 through 3 are the same each time, the other levels are randomly generated.

Special Rules:
    First, 
        Where the ball hits on the paddle will determine its horizontal velocity.


                        Far Left         Slight Left                Slight Right                 Far Right
                        < -                      ^                         ^                         - >
                            \                     \                       /                        /
                              -                    \                     /                      -
                                \                   \                   /                     /
                                --------------------------------------------------------------
                                |                                                            |
                                |                                                            |
                                --------------------------------------------------------------


    Secondly, 
        The ball will increase its speed the more times it hits the paddle. Exponentially
        Ball Speed also increases with each level.
        The paddle also speeds up boith during the game, and on level changes, but much slower


    Finally,
        Different brick colors mean different health


Score:
    100      |   Hit a Brick
    -20      |   Hit the Paddle
    -2500    |   Lose a life

Controls:
    Left, Right --> For the Paddle
    "p" --> To Pause the Game

    Cheats
    "n" --> Next Level, if you get stuck. (I'm not a monster)
    "i" --> Immunity, Can't Die
    "m" --> Activate Multiball
    "b" --> Add Ball when Multiball is Activated



Program Outline:
    1. Program Starts at 692 with the overlay function
    2. The main function is then started with an interval of 10 milSecs.
    3. Every run through main, the program checks if the ball has touched a wall, brick or paddle, and will redraw the ball according       to the ball's velocity. 
    4. Checks are done to see if the level is compled.
    5. Once the level is completed, the currentLevel variable is updated and the program runs again with a new level.