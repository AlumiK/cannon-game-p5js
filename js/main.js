let game
let cannon
let projectile

function setup() {
    createCanvas(1000, 600)
    angleMode(DEGREES)
    game = new Game({
        background: 0,
        iters_per_frame: 10,
        gravity: createVector(0, 0.004),
        ground: {
            fn: x => {
                let sigma = 150
                let factor = 100000
                let miu = 550
                let offset = 500
                return (-1 / (sqrt(2 * PI) * sigma) * exp(-sq(x - miu) / (2 * sq(sigma)))) * factor + offset
            },
            buffer: 50,
            color: 255,
            weight: 1,
            step: 15
        },
        target: {
            margin_left: 200,
            margin_right: 80,
            len: 80,
            color: color(0, 255, 0),
            weight: 5
        },
        text: {
            size: 30,
            color: 255,
            offset: {
                x: 980,
                y: 20
            }
        },
        speed_bar: {
            background: color(0, 0, 255),
            x: 950,
            half_len: 80,
            color: color(0, 255, 0),
            weight: 30
        }
    })
    cannon = new Cannon({
        cannon: {
            x: 50,
            len: 50,
            color: 255,
            weight: 10
        },
        aim_line: {
            min: 0,
            max: 800,
            color: color(255, 0, 0),
            weight: 2,
            end_weight: 10
        },
        aim: {
            radius: 40,
            len: 30,
            color: color(255, 255, 0),
            weight: 1
        },
        text: {
            size: 15,
            color: 255,
            outline: {
                weight: 1,
                color: 0
            },
            offset: {
                x: 60,
                y: -20
            }
        },
        power: {
            min: 3,
            max: 6
        }
    })
    projectile = new Projectile({
        friction: 0.0025,
        projectile: {
            color: 255,
            weight: 10
        },
        last_trajectory: {
            color_hit: color(0, 255, 0),
            color_miss: color(255, 0, 0),
            weight: 1
        },
        trajectory: {
            step: 15,
            color: color(255, 255, 0),
            weight: 3
        }
    })
    game.makeTarget()
}

function draw() {
    background(game.config.background)
    game.showGround()
    game.showTarget()
    cannon.setPower()
    cannon.show()
    projectile.showLastTrajectory()
    if (game.show_prediction) {
        cannon.showAim()
    }
    if (game.projectile_out) {
        projectile.showTrajectory()
        projectile.show()
        for (let i = 0; i < game.config.iters_per_frame; i++) {
            if (game.projectile_out) {
                projectile.move()
                projectile.judge()
            } else {
                break
            }
        }
    }
    game.showText()
    game.showSpeedBar()
}

function mouseClicked() {
    if (!game.projectile_out) {
        game.projectile_out = true
        projectile.pos = cannon.muzzle.copy()
        projectile.trajectory.push(projectile.pos.copy())
        projectile.velocity = cannon.cannon_vec.copy()
        projectile.velocity.setMag(cannon.power)
    }
}

function keyPressed() {
    if (key === 'p') {
        game.show_prediction = !game.show_prediction
    }
}
