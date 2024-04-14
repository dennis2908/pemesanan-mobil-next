import { MenuItemType } from '@paljs/ui/types';

import { storeLogin } from 'components/redux/storeLogin';

const itemsData = () => {
  var roleAss = Object.assign({}, storeLogin.getState().authRoleAssign);

  console.log(11222, roleAss);

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

  let mminjam = {} as MenuItemType;
  let cekmminjam = Object.values(roleAss).find((obj) => {
    return obj === 'mminjam';
  });
  if (cekmminjam)
    mminjam = {
      title: 'Peminjaman Mobil',
      icon: { name: 'browser-outline' },
      children: [
        {
          title: 'List Peminjaman',
          link: { href: '/pinjam/pinjam_list' },
        },
      ],
    };

  let mkembali = {} as MenuItemType;
  let cekmkembali = Object.values(roleAss).find((obj) => {
    return obj === 'mkembali';
  });
  if (cekmkembali)
    mkembali = {
      title: 'Pengembalian Mobil',
      icon: { name: 'browser-outline' },
      children: [
        {
          title: 'List Pengembalian',
          link: { href: '/kembali/kembali_list' },
        },
      ],
    };

  let mmanajemen = {} as MenuItemType;
  let cekmmanajemen = Object.values(roleAss).find((obj) => {
    return obj === 'mmanajemen';
  });
  if (cekmmanajemen)
    mmanajemen = {
      title: 'Manajemen Mobil',
      icon: { name: 'browser-outline' },
      children: [
        {
          title: 'List Mobil',
          link: { href: '/manajemen/manajemen_list' },
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
    mminjam,
    mkembali,
  ];

  return itemsData;
};

const items: MenuItemType[] = itemsData();

export default items;
