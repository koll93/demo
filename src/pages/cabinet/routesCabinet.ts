const routesCabinet = [
    {
      path: '/cabinet',
      component: () => import('pages/cabinet/CabinetLayout.vue'),
      meta: { auth: true },
      children: [
        {
          path: 'first-slot',
          component: () => import('pages/cabinet/pages/CameraSlotPage.vue'),
          name: '__FIRST_SLOT_PAGE__'
        }
      ]
    }
  ];

export default routesCabinet;
