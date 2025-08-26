import app from 'ags/gtk4/app'
import Adw from 'gi://Adw'
import Pango from 'gi://Pango'
import { For, Accessor, With, createState } from 'ags'
import { Gdk, Gtk } from 'ags/gtk4'
import { useUserListService } from '@services/UserListService'
import scss from './style.scss'

app.apply_css(scss)

export default function UserCarousel() {
  const { userList, selectedUserIndex, setSelectedUserIndex } = useUserListService()
  const [userListCarousel, setUserListCarousel] = createState<Adw.Carousel | null>(null)
  const [userListCarouselChildrens, setUserListCarouselChildrens] = createState<Gtk.Box[]>([])

  const setUserListCarouselChildrenProps = (position: number) => {
    userListCarouselChildrens.get().forEach((box, index) => {
      if (position === index) {
        box.set_opacity(1)
        box.add_css_class('UserCarouselSlideActive')
      }
      else {
        box.remove_css_class('UserCarouselSlideActive')
        box.set_opacity(0.5)
      }
    })
  }

  selectedUserIndex.subscribe(() => {
    const position = selectedUserIndex.get()
    scrollTo(position)
    setUserListCarouselChildrenProps(position)
  })

  userListCarouselChildrens.subscribe(() => {
    setUserListCarouselChildrenProps(selectedUserIndex.get())
  })

  const navigationButtonProps: Partial<Gtk.Button> = {
    cursor: new Gdk.Cursor({ name: 'pointer' }),
    cssClasses: ['UserCarouselButton'],
  }

  const scrollTo = (index: number, animation: boolean = true) => {
    const userListCarouselRef = userListCarousel.get()
    if (userListCarouselRef) {
      const targetPage = userListCarouselRef.get_nth_page(index)
      userListCarouselRef.scroll_to(targetPage, animation)
    }
  }

  const UserNameLabel = (name: string) => (
    <Gtk.Label
      cssClasses={['UserCarouselCaption']}
      label={name}
      maxWidthChars={12}
      widthRequest={220}
      ellipsize={Pango.EllipsizeMode.END}
    />
  )

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
            const position = Math.round(carousel.position)
            setSelectedUserIndex(position)
          }}
        >
          <For each={userList}>
            {(user, index: Accessor<number>) => (
              <Gtk.Box
                name={`UserCard-${index.get()}`}
                cssClasses={['UserCarouselSlide']}
                orientation={Gtk.Orientation.VERTICAL}
                halign={Gtk.Align.CENTER}
                vexpand={false}
                onRealize={(box) => {
                  setUserListCarouselChildrens([...userListCarouselChildrens.get(), box])
                  const gesture = new Gtk.GestureClick({ propagationPhase: Gtk.PropagationPhase.BUBBLE })
                  gesture.connect('released', () => {
                    setSelectedUserIndex(index.get())
                  })
                  box.add_controller(gesture)
                }}
                cursor={new Gdk.Cursor({ name: 'pointer' })}
                widthRequest={220}
              >
                <Adw.Avatar size={172} text={user.realName} showInitials={true} customImage={user.userPicture}></Adw.Avatar>
                <Gtk.Box
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
          {value => value instanceof Adw.Carousel && <Adw.CarouselIndicatorDots carousel={value} /> }
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
