import Background from "./Background.js"
import Wall from "./Wall.js"
import Player from "./Player.js"

export default class App {
  static canvas = document.querySelector("canvas")
  static ctx = App.canvas.getContext("2d")
  static dpr = devicePixelRatio > 1 ? 2 : 1
  static interval = 1000 / 60
  static width = 1024
  static height = 768

  constructor() {
    this.backgrounds = [
      new Background({ img: document.querySelector("#bg3-img"), speed: 1 }),
      new Background({ img: document.querySelector("#bg2-img"), speed: 2 }),
      new Background({ img: document.querySelector("#bg1-img"), speed: 4 })
    ]
    this.walls = [new Wall({ type: "SMALL" })]
    this.player = new Player()


    // 🎯 자동으로 실행되는 로직, bind로 this조정
    window.addEventListener("resize", this.resize.bind(this))
  }

  resize() {
    App.canvas.width = App.width * App.dpr
    App.canvas.height = App.height * App.dpr
    App.ctx.scale(App.dpr, App.dpr)

    // 화면의 가로 세로 비율이 항상 4 : 3을 유지하게 하는 로직
    const width = window.innerWidth > window.innerHeight ?
      window.innerHeight * 0.9 :
      window.innerWidth * 0.9
    App.canvas.style.width = `${width}px`
    App.canvas.style.height = `${width * (3 / 4)}px`
  }

  render() {
    let now, delta
    let then = Date.now()

    const frame = () => {
      requestAnimationFrame(frame)
      now = Date.now()
      delta = now - then
      if (delta < App.interval) return


      App.ctx.clearRect(0, 0, App.width, App.height)
      App.ctx.fillRect(50, 50, 100, 100)

      // 배경 애니메이션
      this.backgrounds.forEach(background => {
        background.update()
        background.draw()
      })

      // 벽(장애물) 애니메이션
      let newWall = []

      this.walls.forEach(wall => {
        wall.update();
        wall.draw();

        // 벽 생성
        if (wall.canGenerateNext) {
          wall.generatedNext = true
          newWall = [new Wall({ type: Math.random() > 0.3 ? 'SMALL' : 'BIG' })]
        }

        if (wall.isColliding(this.player.boundingBox)) {
          console.log("충돌이다아아아아ㅏ")
        }
      })
      // 새로운 벽이 생겼다면 this.walls와 병합
      this.walls = this.walls.filter(wall => !wall.isOutside).concat(newWall)

      // 플레이어 애니메이션
      // 🩺바운딩 박스를 위한 임시 주석
      // this.player.update()
      this.player.draw()


      then = now - (delta % App.interval)
    }
    requestAnimationFrame(frame)
  }
};