import Adw from 'gi://Adw'
import Pango from 'gi://Pango'

import { For, With, createState, onCleanup, createComputed } from 'ags'
import { Gdk, Gtk } from 'ags/gtk4'
import app from 'ags/gtk4/app'

import { createDisposeManager } from '../../../libs/gnim-extensions'
import { useUserService } from '../../../services'
import { User } from '../../../services/AuthService'

import scss from './style.scss'

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
  const userService = useUserService()
  const [userListCarousel, setUserListCarousel] = createState<Adw.Carousel | null>(null)
  const [selectedIndex, setSelectedIndex] = createState<number>(0)
  const [triggerUpdate, setTriggerUpdate] = createState<number>(0) // For triggering updates

  // Navigation button visibility
  const navigationButtonProps: Partial<Gtk.Button> = {
    cursor: new Gdk.Cursor({ name: 'pointer' }),
    cssClasses: ['UserCarouselButton'],
    visible: userService.availableUsers.length > 1,
  }

  const scrollTo = (index: number, animation: boolean = true) => {
    const userListCarouselRef = userListCarousel()
    if (userListCarouselRef) {
      const targetPage = userListCarouselRef.get_nth_page(index)
      userListCarouselRef.scroll_to(targetPage, animation)
    }
  }

  const [disposes, dispose] = createDisposeManager()

  // Listen to user selection changes
  const userSelectedHandler = userService.connect('user-selected', () => {
    // Update carousel position when user is selected
    const currentUser = userService.currentUser
    if (currentUser) {
      const index = userService.availableUsers.findIndex(u => u.name === currentUser.name)
      if (index >= 0) {
        setSelectedIndex(index)
        scrollTo(index)
      }
    }
  })

  disposes.push(() => userService.disconnect(userSelectedHandler))

  onCleanup(() => {
    dispose()
  })

  return (
    <Gtk.Box orientation={Gtk.Orientation.HORIZONTAL}>
      <Gtk.Button
        iconName="go-previous"
        onClicked={() => {
          const userListCarouselRef = userListCarousel()
          if (userListCarouselRef) {
            const currentPos = Math.ceil(userListCarouselRef.position)
            const newIndex = currentPos > 0 ? currentPos - 1 : userService.availableUsers.length - 1
            setSelectedIndex(newIndex)
            if (userService.availableUsers[newIndex]) {
              userService.selectUser(userService.availableUsers[newIndex])
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
          allowLongSwipes={true}
          onRealize={(carousel) => {
            setUserListCarousel(carousel)
            scrollTo(selectedIndex(), false)
          }}
          onPageChanged={(carousel) => {
            const newIndex = Math.round(carousel.position)
            setSelectedIndex(newIndex)
            if (userService.availableUsers[newIndex]) {
              userService.selectUser(userService.availableUsers[newIndex])
            }
          }}
        >
          <For each={createComputed(() => userService.availableUsers)}>
            {(user: User, index) => (
              <Gtk.Box
                cssClasses={createComputed(() => {
                  const selected = selectedIndex()
                  return ['UserCarouselSlide', ...(selected === index() ? ['UserCarouselSlideActive'] : [])]
                })}
                orientation={Gtk.Orientation.VERTICAL}
                halign={Gtk.Align.CENTER}
                vexpand={false}
                cursor={userService.availableUsers.length > 1
                  ? new Gdk.Cursor({ name: 'pointer' })
                  : new Gdk.Cursor({ name: 'default' })
                }
                widthRequest={220}
                heightRequest={270}
                opacity={createComputed(() => {
                  const selected = selectedIndex()
                  return selected === index() ? 1 : 0.5
                })}
              >
                <Gtk.GestureClick
                  onReleased={() => {
                    setSelectedIndex(index())
                    userService.selectUser(user)
                  }}
                />
                <Adw.Avatar
                  size={172}
                  text={user.realName || user.name}
                  showInitials={true}
                  customImage={user.avatar ? Gdk.Texture.new_from_filename(user.avatar) : undefined}
                />
                <Gtk.Box
                  cssClasses={['UserCarouselCaptionContainer']}
                  orientation={Gtk.Orientation.VERTICAL}
                  vexpand={true}
                  halign={Gtk.Align.CENTER}
                  valign={Gtk.Align.CENTER}
                >
                  {user.realName && user.realName.length > 14
                    ? user.realName.split(' ').map(UserNameLabel)
                    : UserNameLabel(user.realName || user.name)
                  }
                </Gtk.Box>
              </Gtk.Box>
            )}
          </For>
        </Adw.Carousel>
        <With value={userListCarousel}>
          {value => value instanceof Adw.Carousel && (
            <Adw.CarouselIndicatorDots
              carousel={value}
              visible={userService.availableUsers.length > 1}
            />
          )}
        </With>
      </Gtk.Box>
      <Gtk.Button
        iconName="go-next"
        onClicked={() => {
          const userListCarouselRef = userListCarousel()
          if (userListCarouselRef) {
            const currentPos = Math.floor(userListCarouselRef.position)
            const newIndex = currentPos < userService.availableUsers.length - 1 ? currentPos + 1 : 0
            setSelectedIndex(newIndex)
            if (userService.availableUsers[newIndex]) {
              userService.selectUser(userService.availableUsers[newIndex])
            }
          }
        }}
        {...navigationButtonProps}
      />
    </Gtk.Box>
  )
}
