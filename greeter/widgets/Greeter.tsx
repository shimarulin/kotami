import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { execAsync } from "ags/process"
import { createPoll } from "ags/time"
import UserList, { UserListItem } from "../../session-control/widgets/UserList"
import Adw from "gi://Adw"
import { Accessor } from "gnim"
import UserSelect from "../../session-control/widgets/UserSelect"

export default function Greeter(gdkmonitor: Gdk.Monitor) {
    const { TOP, LEFT, RIGHT, BOTTOM } = Astal.WindowAnchor

    const time = createPoll("", 1000, "date")

    const userListItems: UserListItem[] = [{ name: 'user-one' }, { name: 'user-two' }]

    let carouselRef = null

    return (
        <window
            visible
            name="greeter"
            class="Greeter"
            gdkmonitor={gdkmonitor}
            exclusivity={Astal.Exclusivity.EXCLUSIVE}
            anchor={TOP | LEFT | RIGHT | BOTTOM}
            application={app}
        >
            {/* <box
                halign={Gtk.Align.CENTER}
                valign={Gtk.Align.CENTER}
                hexpand
                vexpand
                class={"base"}
            >
                <label label="Welcome to AGS!" />
                <button
                    $type="start"
                    onClicked={() => execAsync("echo hello").then(console.log)}
                    hexpand
                    halign={Gtk.Align.CENTER}
                >

                    <label label="Welcome to AGS!" />
                </button>

                <UserSelect />
            </box>
            <box>
            </box> */}
            <Gtk.Box orientation={Gtk.Orientation.VERTICAL}>
                <UserSelect />

                <Gtk.PasswordEntry showPeekIcon={true} placeholderText={'Password'}></Gtk.PasswordEntry>

                <Gtk.ListBox selectionMode={Gtk.SelectionMode.NONE}>
                    <Gtk.ListBoxRow>
                        <Gtk.Box orientation={Gtk.Orientation.VERTICAL}>
                            <Gtk.PasswordEntry showPeekIcon={true} placeholderText={'Password'}></Gtk.PasswordEntry>
                        </Gtk.Box>
                    </Gtk.ListBoxRow>
                    <Adw.SwitchRow title={"Sw"} />
                    <Adw.PasswordEntryRow title={"Password"} text={"123"} />
                </Gtk.ListBox>
            </Gtk.Box>
        </window>
    )
}
