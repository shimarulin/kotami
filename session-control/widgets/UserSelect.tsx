import Adw from "gi://Adw?version=1";
import { For, Accessor, createState } from "ags"
import { Gtk } from "ags/gtk4";

export interface UserSelectItem {
  name: string;
  displayName: string;
}

export interface UserSelectProps {
  users: UserSelectItem[];
  selectedUserName?: string;
}

export default function UserSelect() {
  // let users: Accessor<Array<UserSelectItem>> = new Accessor(() => [])
  const [userList, setUserList] = createState<UserSelectItem[]>([])

  let userListCarouselRef: Adw.Carousel | null = null

  setUserList([
    {
      displayName: "Bak Frow",
      name: "bf",
    },
    {
      displayName: "Mica Torm",
      name: "mt",
    },
    {
      displayName: "Tear Gream",
      name: "tg",
    },
    {
      displayName: "Bak Frow",
      name: "bf",
    },
    {
      displayName: "Mica Torm",
      name: "mt",
    },
  ])

  // setTimeout(() => {
  //   setUserList([
  //     {
  //       displayName: "Bak Frow",
  //       name: "bf",
  //     },
  //     {
  //       displayName: "Mica Torm",
  //       name: "mt",
  //     },
  //     {
  //       displayName: "Tear Gream",
  //       name: "tg",
  //     },
  //   ])
  //   if (userListCarouselRef) {
  //     const secondPage = userListCarouselRef.get_nth_page(1);
  //     if (secondPage) {
  //       userListCarouselRef.scroll_to(secondPage, false);
  //     }
  //   }
  // }, 2000)
  let canPageChanged = true

  return (
    <Adw.Carousel
      spacing={24}
      onRealize={(carousel) => {
        // У нас нет свойства 'ref', как в React/Vue,
        // но ты можем получить экземпляр нативного инстанса
        // при создании и сохранить во внешней переменной
        // иммитируя тем самым поведение 'ref'
        userListCarouselRef = carousel
        // canPageChanged = false
        // console.log("\nonRealize")
        // // Получаем вторую страницу по индексу
        // const secondPage = carousel.get_nth_page(1);
        // if (secondPage) {
        //   carousel.scroll_to(secondPage, false);
        // }
      }}
      onPageChanged={(carousel) => {
        console.log(carousel.position)
      }}
    >
      <For each={userList}>
        {(user, index: Accessor<number>) => (
          <box
            name={`b-${index}`}
            onRealize={(box) => {
              // Добавляем обработку нажатия
              // Имитация клика происходит при отпускании,
              // чтобы не было конфликта с жестом смахивания
              const gesture = new Gtk.GestureClick();
              gesture.connect("released", () => {
                if (userListCarouselRef) {
                  const targetPage = userListCarouselRef.get_nth_page(index.get());
                  userListCarouselRef?.scroll_to(targetPage, true)
                }
              });
              box.add_controller(gesture);
            }}
          >
            <Adw.Avatar size={128} text={user.displayName} showInitials={true}></Adw.Avatar>
          </box>
        )}
      </For>
    </Adw.Carousel>
  )
}
