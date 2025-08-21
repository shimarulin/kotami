import app from "ags/gtk4/app"
import Greeter from "./widgets/Greeter"

app.start({
  main() {
    app.get_monitors().map(Greeter)
  },
})
