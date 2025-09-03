import app from 'ags/gtk4/app'
import Adw from 'gi://Adw'
import Pango from 'gi://Pango'
import { For, With, createState, onCleanup, createComputed } from 'ags'
import { Gdk, Gtk } from 'ags/gtk4'
import { useUserListService } from '@services/UserListService'
import scss from './style.scss'
import { createDisposeManager } from '@libs/gnim-extensions'

app.apply_css(scss)

const UserNameLabel = (name: string) => (
  <Gtk.Label
    cssClasses={['UserCarouselCaption']}
    label={name}
    maxWidthChars={12}
    widthRequest={220}
    ellipsize={Pango.EllipsizeMode.END}
  />
)

export default function UserCarousel() {
  const { userList, selectedUserIndex, setSelectedUserIndex } = useUserListService()
  const [userListCarousel, setUserListCarousel] = createState<Adw.Carousel | null>(null)

  const navigationButtonProps: Partial<Gtk.Button> = {
    cursor: new Gdk.Cursor({ name: 'pointer' }),
    cssClasses: ['UserCarouselButton'],
    visible: userList.get().length > 1,
  }

  const scrollTo = (index: number, animation: boolean = true) => {
    const userListCarouselRef = userListCarousel.get()
    if (userListCarouselRef) {
      const targetPage = userListCarouselRef.get_nth_page(index)
      userListCarouselRef.scroll_to(targetPage, animation)
    }
  }

  const [disposes, dispose] = createDisposeManager()

  disposes.push(selectedUserIndex.subscribe(() => {
    const position = selectedUserIndex.get()
    scrollTo(position)
  }))

  onCleanup(() => {
    dispose()
  })

  return (
    <Gtk.Box orientation={Gtk.Orientation.HORIZONTAL}>
      <Gtk.Button
        iconName="go-previous"
        onClicked={() => {
          const userListCarouselRef = userListCarousel.get()
          if (userListCarouselRef) {
            if (userListCarouselRef.position > 0) {
              setSelectedUserIndex(Math.ceil(userListCarouselRef.position) - 1)
            }
            else {
              setSelectedUserIndex(userList.get().length - 1)
            }
          }
        }}
        {...navigationButtonProps}
      />
      <Gtk.Box orientation={Gtk.Orientation.VERTICAL}>
        <Adw.Carousel
          cssClasses={['UserCarousel']}
          spacing={24}
          hexpand={true}
          halign={Gtk.Align.FILL}
          scrollParams={new Adw.SpringParams(1, 0.5, 1000)}
          onRealize={(carousel) => {
            setUserListCarousel(carousel)
            scrollTo(selectedUserIndex.get(), false)
          }}
          onPageChanged={(carousel) => {
            setSelectedUserIndex(Math.round(carousel.position))
          }}
        >
          <For each={userList}>
            {(user, index) => (
              <Gtk.Box
                cssClasses={createComputed([selectedUserIndex, index], (n, i) => {
                  const classList: string[] = ['UserCarouselSlide']
                  if (n === i) {
                    classList.push('UserCarouselSlideActive')
                  }
                  return classList
                })}
                orientation={Gtk.Orientation.VERTICAL}
                halign={Gtk.Align.CENTER}
                vexpand={false}
                cursor={userList.get().length > 1 ? new Gdk.Cursor({ name: 'pointer' }) : new Gdk.Cursor({ name: 'default' })}
                widthRequest={220}
                heightRequest={270}
                opacity={createComputed([selectedUserIndex, index], (n, i) => n === i ? 1 : 0.5)}
              >
                <Gtk.GestureClick
                  onReleased={() => {
                    setSelectedUserIndex(index.get())
                  }}
                />
                <Adw.Avatar
                  size={172}
                  text={user.realName}
                  showInitials={true}
                  customImage={user.userPicture}
                >
                </Adw.Avatar>
                <Gtk.Box
                  cssClasses={['UserCarouselCaptionContainer']}
                  orientation={Gtk.Orientation.VERTICAL}
                  vexpand={true}
                  halign={Gtk.Align.CENTER}
                  valign={Gtk.Align.CENTER}
                >
                  {user.realName.length > 14 ? user.realName.split(' ').map(UserNameLabel) : UserNameLabel(user.realName)}
                </Gtk.Box>
              </Gtk.Box>
            )}
          </For>
        </Adw.Carousel>
        <With value={userListCarousel}>
          {value => value instanceof Adw.Carousel && <Adw.CarouselIndicatorDots carousel={value} visible={userList.get().length > 1} /> }
        </With>
      </Gtk.Box>
      <Gtk.Button
        iconName="go-next"
        onClicked={() => {
          const userListCarouselRef = userListCarousel.get()
          if (userListCarouselRef) {
            if (userListCarouselRef.position < userList.get().length - 1) {
              setSelectedUserIndex(Math.floor(userListCarouselRef.position) + 1)
            }
            else {
              setSelectedUserIndex(0)
            }
          }
        }}
        {...navigationButtonProps}
      />
    </Gtk.Box>
  )
}
