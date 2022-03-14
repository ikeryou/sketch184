import { Func } from '../core/func';
import { Canvas } from '../webgl/canvas';
import { Object3D } from 'three/src/core/Object3D';
import { Conf } from '../core/conf';
import { Color } from "three/src/math/Color";
import { SphereGeometry } from "three/src/geometries/SphereGeometry";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { Mesh } from 'three/src/objects/Mesh';
import { Util } from '../libs/util';

export class Con extends Canvas {

  private _con: Object3D;
  private _ball:Mesh;
  private _textList:Array<string> = []

  constructor(opt: any) {
    super(opt);

    this._con = new Object3D()
    this.mainScene.add(this._con)

    // 表示に使うテキスト入れておく
    this._textList = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')

    this._ball = new Mesh(
      new SphereGeometry(0.5, 64, 64),
      new MeshBasicMaterial({
        color:0xff0000,
        transparent:true
      })
    )
    this._con.add(this._ball)

    //console.log('%cSKETCH.181', 'border:5px solid #0000FF;border-radius:0px;padding:20px;color:#FFF;font-size:30px;')

    this._resize()
  }


  protected _update(): void {
    super._update()
    this._con.position.y = Func.instance.screenOffsetY() * -1

    const sw = Func.instance.sw()
    const sh = Func.instance.sh()

    const scale = Util.instance.map(Math.sin(this._c * 0.1), 0.2, 1, -1, 1)

    // コンソール出力
    // let mx = (Mouse.instance.easeNormal.x + 1) * 0.5
    // let my = (Mouse.instance.easeNormal.y + 1) * 0.5

    // const fontSize = Util.instance.map(mx, 10, 600, 0, 1)
    let h = this._c * 4
    const col = new Color('hsl(' + h + ', 100%, 50%)')
    // const col2 = new Color(1 - col.r, 1 - col.g, 1 - col.b)

    // console.log('%c_______________________________________________________________________', 'background-color:#' + col.getHexString())
    // console.log('%cSKETCH.181', 'font-size:' + fontSize + 'px;font-weight:bold;color:#' + col.getHexString())

    const isStart = this._ball.position.y > sh * 0.45
    let text = ''
    const textNum = 140
    const x = Util.instance.map(this._ball.position.x, 0, 1, -sw * 0.5, sw * 0.5)
    const range = Util.instance.map(scale, 0.02, 0.1, 0.2, 1)
    for(let i = 0; i < textNum; i++) {
      const key = (this._c + i) % (this._textList.length - 1)
      const per = i / textNum
      if(isStart && Math.abs(per - x) < range) {
        text += '_'
      } else {
        text += this._textList[key]
      }
    }

    // console.log('%c' + text, 'background-color:#' + col.getHexString() + ';color:#' + col2.getHexString() + ';font-size:10px;border:2px solid #' + col2.getHexString() + ';padding-right:' + fontSize + 'px')

    console.log('%c' + text, 'font-weight:normal; color:#' + col.getHexString() + ';font-size:14px;background-color:#000;')




    let ballScale = sh * 0.3
    ballScale *= scale
    this._ball.scale.set(ballScale, ballScale, ballScale)

    this._ball.position.y += 6
    if(this._ball.position.y > sh) {
      this._ball.position.y = -sh * 0.5 - ballScale
      this._ball.position.x = Util.instance.range(sw * 0.35)
    }
    (this._ball.material as MeshBasicMaterial).color = col

    if (this.isNowRenderFrame()) {
      this._render()
    }
  }


  private _render(): void {
    const bgColor = 0x000000
    this.renderer.setClearColor(bgColor, 1)
    this.renderer.render(this.mainScene, this.camera)
  }


  public isNowRenderFrame(): boolean {
    return this.isRender
  }


  _resize(isRender: boolean = true): void {
    super._resize();

    const w = Func.instance.sw();
    const h = Func.instance.sh();

    if(Conf.instance.IS_SP || Conf.instance.IS_TAB) {
      if(w == this.renderSize.width && this.renderSize.height * 2 > h) {
        return
      }
    }

    this.renderSize.width = w;
    this.renderSize.height = h;

    this.updateCamera(this.camera, w, h);

    let pixelRatio: number = window.devicePixelRatio || 1;

    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(w, h);
    this.renderer.clear();

    if (isRender) {
      this._render();
    }
  }
}
