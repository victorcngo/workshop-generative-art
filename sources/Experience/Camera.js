import { PerspectiveCamera } from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera {
    constructor(_options) {
        // Options
        this.experience = new Experience()
        this.config = this.experience.config
        this.debug = this.experience.debug
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.targetElement = this.experience.targetElement
        this.scene = this.experience.scene

        this.order = 'YXZ'

        // Set up
        this.mode = 'debug'

        if (this.debug) {
            this.debugCameraFolder = this.debug.addFolder('Camera')
        }

        this.setInstance()
        this.setModes()
    }

    setInstance() {
        // Set up
        this.instance = new PerspectiveCamera(
            25,
            this.config.width / this.config.height,
            0.1,
            150
        )
        this.instance.rotation.reorder(this.order)
        this.instance.near = 0

        this.scene.add(this.instance)
    }

    setModes() {
        this.modes = {}

        // Default
        this.modes.default = {}
        this.modes.default.instance = this.instance.clone()
        this.modes.default.instance.rotation.reorder(this.order)
        this.modes.default.instance.position.set(-7, 6, 10)
        this.modes.default.instance.rotation.set(-0.43, -0.6, 0)

        // Focus
        this.modes.focus = {}
        this.modes.focus.instance = this.instance.clone()
        this.modes.focus.instance.position.set(-0.145, 0.6, 2.3)

        // Debug
        this.modes.debug = {}
        this.modes.debug.instance = this.instance.clone()
        this.modes.debug.instance.position.set(-7, 6, 10)
        this.modes.debug.instance.rotation.set(-0.43, -0.6, 0)
        this.modes.debug.orbitControls = new OrbitControls(
            this.modes.debug.instance,
            this.targetElement
        )
        this.modes.debug.orbitControls.enabled = this.modes.debug.active
        this.modes.debug.orbitControls.screenSpacePanning = true
        this.modes.debug.orbitControls.enableKeys = false
        this.modes.debug.orbitControls.maxPolarAngle = Math.PI * 0.4
        this.modes.debug.orbitControls.zoomSpeed = 0.25
        this.modes.debug.orbitControls.enableDamping = true
        this.modes.debug.orbitControls.update()

        /**
         * Debug options
         */

        if (this.debug) {
            this.debugCameraFolder
                .add(this, 'mode', ['default', 'focus', 'debug'])
                .onFinishChange(() => {
                    this.modes.debug.orbitControls.update()
                })
        }
    }

    resize() {
        this.instance.aspect = this.config.width / this.config.height
        this.instance.updateProjectionMatrix()

        this.modes.default.instance.aspect =
            this.config.width / this.config.height
        this.modes.default.instance.updateProjectionMatrix()

        this.modes.debug.instance.aspect =
            this.config.width / this.config.height
        this.modes.debug.instance.updateProjectionMatrix()
    }

    update() {
        // Update debug orbit controls
        this.modes.debug.orbitControls.update()

        // Apply coordinates
        this.instance.position.copy(this.modes[this.mode].instance.position)
        this.instance.quaternion.copy(this.modes[this.mode].instance.quaternion)
        this.instance.updateMatrixWorld() // To be used in projection
    }

    destroy() {
        this.modes.debug.orbitControls.destroy()
    }
}
