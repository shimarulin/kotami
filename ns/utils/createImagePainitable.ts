import { Gdk } from 'ags/gtk4'
import Gio from 'gi://Gio'

export function createImagePainitable(filePath: string): Gdk.Texture | undefined {
  try {
    const file = Gio.File.new_for_path(filePath)
    return Gdk.Texture.new_from_file(file)
  }
  catch {
    return
  }
}
