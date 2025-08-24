import Adw from 'gi://Adw'
import { For, Accessor } from 'ags'
import { Gtk } from 'ags/gtk4'
import { useUserListService } from '@services/UserListService'

export default function UserCarousel() {
  let userListCarouselRef: Adw.Carousel | null = null
  const { userList, selectedUserIndex, setSelectedUserIndex } = useUserListService()

  const scrollTo = (index: number, animation: boolean = true) => {
    if (userListCarouselRef) {
      const targetPage = userListCarouselRef.get_nth_page(index)
      userListCarouselRef.scroll_to(targetPage, animation)
    }
  }

  return (
    <Gtk.Box orientation={Gtk.Orientation.HORIZONTAL}>
      <Gtk.Button
        iconName="go-previous"
        onClicked={() => {
          if (userListCarouselRef) {
            if (userListCarouselRef.position > 0) {
              scrollTo(Math.ceil(userListCarouselRef.position) - 1)
            }
            else {
              scrollTo(userList.get().length - 1)
            }
          }
        }}
      />
      <Adw.Carousel
        spacing={24}
        hexpand={true}
        halign={Gtk.Align.FILL}
        scrollParams={new Adw.SpringParams(1, 0.5, 1000)}
        onRealize={(carousel) => {
          userListCarouselRef = carousel
          scrollTo(selectedUserIndex.get(), false)
        }}
        onPageChanged={(carousel) => {
          setSelectedUserIndex(Math.round(carousel.position))
        }}
      >
        <For each={userList}>
          {(user, index: Accessor<number>) => (
            <box
              name={`UserCard-${index.get()}`}
              onRealize={(box) => {
                const gesture = new Gtk.GestureClick()
                gesture.connect('released', () => {
                  scrollTo(index.get())
                })
                box.add_controller(gesture)
              }}
            >
              <Gtk.Box orientation={Gtk.Orientation.VERTICAL}>
                <Adw.Avatar size={128} text={user.realName} showInitials={true} customImage={user.userPicture}></Adw.Avatar>
                <Gtk.Label label={user.realName} />
              </Gtk.Box>
            </box>
          )}
        </For>
      </Adw.Carousel>
      <Gtk.Button
        iconName="go-next"
        onClicked={() => {
          if (userListCarouselRef) {
            if (userListCarouselRef.position < userList.get().length - 1) {
              scrollTo(Math.floor(userListCarouselRef.position) + 1)
            }
            else {
              scrollTo(0)
            }
          }
        }}
      />
    </Gtk.Box>
  )
}
