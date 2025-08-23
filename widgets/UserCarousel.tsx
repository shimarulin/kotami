import Adw from 'gi://Adw'
import { For, Accessor } from 'ags'
import { Gtk } from 'ags/gtk4'
import { useUserListService } from '@services/UserListService'

export default function UserCarousel() {
  let userListCarouselRef: Adw.Carousel | null = null
  const { userList, selectedUserName, setSelectedUserName } = useUserListService()

  return (
    <Adw.Carousel
      spacing={24}
      onRealize={(carousel) => {
        userListCarouselRef = carousel

        const selectedUserNameString = selectedUserName.get()
        const selectedUserListItemIndex = userList.get().findIndex(userListItem => userListItem.userName === selectedUserNameString)

        if (selectedUserNameString && selectedUserListItemIndex !== carousel.position) {
          const targetPage = userListCarouselRef.get_nth_page(selectedUserListItemIndex)
          carousel.scroll_to(targetPage, false)
        }
      }}
      onPageChanged={(carousel) => {
        setSelectedUserName(userList.get()[carousel.position].userName)
      }}
    >
      <For each={userList}>
        {(user, index: Accessor<number>) => (
          <box
            name={`UserCard-${index.get()}`}
            onRealize={(box) => {
              const gesture = new Gtk.GestureClick()
              gesture.connect('released', () => {
                if (userListCarouselRef) {
                  const targetPage = userListCarouselRef.get_nth_page(index.get())
                  userListCarouselRef?.scroll_to(targetPage, true)
                }
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
  )
}
