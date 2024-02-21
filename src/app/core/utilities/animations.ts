import { animate, style, transition, trigger } from "@angular/animations";

export const routerTransitionFade = trigger('routerTransitionFade', [
  transition('* <=> *', [
    style({ opacity: 0 }),
    animate('0.5s ease-in-out', style({ opacity: 1 })),
  ]),
]);

export const routerTransitionSlideLeft = trigger('routerTransitionSlideLeft', [
  transition(':enter', [
    style({ transform: 'translateX(-100%)' }),
    animate('0.5s ease-in-out', style({ transform: 'translateX(0)' })),
  ]),
  transition(':leave', [
    animate('0.5s ease-in-out', style({ transform: 'translateX(-100%)' })),
  ]),
]);

export const routerTransitionSlideRight = trigger(
  'routerTransitionSlideRight',
  [
    transition(':enter', [
      style({ transform: 'translateX(100%)' }),
      animate('0.5s ease-in-out', style({ transform: 'translateX(0)' })),
    ]),
    transition(':leave', [
      animate('0.5s ease-in-out', style({ transform: 'translateX(100%)' })),
    ]),
  ]
);

export const routerTransitionSlideUp = trigger('routerTransitionSlideUp', [
  transition(':enter', [
    style({ transform: 'translateY(100%)' }),
    animate('0.5s ease-in-out', style({ transform: 'translateY(0)' })),
  ]),
  transition(':leave', [
    animate('0.5s ease-in-out', style({ transform: 'translateY(-100%)' })),
  ]),
]);

export const routerTransitionSlideDown = trigger('routerTransitionSlideDown', [
  transition(':enter', [
    style({ transform: 'translateY(-100%)' }),
    animate('0.5s ease-in-out', style({ transform: 'translateY(0)' })),
  ]),
  transition(':leave', [
    animate('0.5s ease-in-out', style({ transform: 'translateY(100%)' })),
  ]),
]);

export const routerTransitionZoom = trigger('routerTransitionZoom', [
  transition('* <=> *', [
    style({ transform: 'scale(0.5)' }),
    animate('0.5s ease-in-out', style({ transform: 'scale(1)' })),
  ]),
]);
