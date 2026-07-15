// Экраны расследования — часть движка, а не конкретного дела.
// Заставка дела («обложка папки») + шесть этапов.
export const SCREENS = [
  'splash',
  'board',
  'suspects',
  'interrogation',
  'timeline',
  'accusation',
  'solution',
]

export const SCREEN_TITLES = {
  splash: 'Заставка',
  board: 'Доска улик',
  suspects: 'Подозреваемые',
  interrogation: 'Допрос',
  timeline: 'Хронология',
  accusation: 'Обвинение',
  solution: 'Разгадка',
}
