import { MenuItemType } from '@paljs/ui/types';

import { storeLogin } from 'components/redux/storeLogin';

const itemsData = () => {
  var roleAss = Object.assign({}, storeLogin.getState().authRoleAssign);

  let mrole = {} as MenuItemType;
  let cekmrole = Object.values(roleAss).find((obj) => {
    return obj === 'mrole';
  });
  if (cekmrole)
    mrole = {
      title: 'Role',
      icon: { name: 'browser-outline' },
      children: [
        {
          title: 'List Role',
          link: { href: '/role/role_list' },
        },
      ],
    };

  let mmanajemen = {} as MenuItemType;
  let cekmanajemen = Object.values(roleAss).find((obj) => {
    return obj === 'mmanajemen';
  });
  if (cekmanajemen)
    mmanajemen = {
      title: 'Manajemen',
      icon: { name: 'browser-outline' },
      children: [
        {
          title: 'List Manajemen',
          link: { href: '/manajemen/manajemen_list' },
        },
      ],
    };
  let mmminjam = {} as MenuItemType;
  let cekmminjam = Object.values(roleAss).find((obj) => {
    return obj === 'mminjam';
  });
  if (cekmminjam)
    mmminjam = {
      title: 'Peminjaman',
      icon: { name: 'browser-outline' },
      children: [
        {
          title: 'List Peminjaman',
          link: { href: '/pinjam/pinjam_list' },
        },
      ],
    };

  let mmkembali = {} as MenuItemType;
  let cekmkembali = Object.values(roleAss).find((obj) => {
    return obj === 'mkembali';
  });
  if (cekmkembali)
    mmkembali = {
      title: 'Pengembalian',
      icon: { name: 'browser-outline' },
      children: [
        {
          title: 'List Pengembalian',
          link: { href: '/kembali/kembali_list' },
        },
      ],
    };

  const itemsData: MenuItemType[] = [
    {
      title: 'Home Page',
      icon: { name: 'home' },
      link: { href: '/dashboard' },
    },
    {
      title: 'MASTER',
      group: true,
    },
    mrole,
    mmanajemen,
    mmminjam,
    mmkembali,
  ];

  return itemsData;
};
const items: MenuItemType[] = itemsData();

export default items;
