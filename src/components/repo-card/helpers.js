const configureDate = type => delta => {
  switch (type) {
    case 'seconds': {
      return parseInt(delta / 1000, 10)
    }
    case 'minutes': {
      return parseInt(delta / 1000 / 60, 10)
    }
    case 'hours': {
      return parseInt(delta / 1000 / 60 / 60, 10)
    }
    case 'days': {
      return parseInt(delta / 1000 / 60 / 60 / 24, 10)
    }
    default:
      return delta
  }
}

const time = {
  seconds: configureDate('seconds'),
  minutes: configureDate('minutes'),
  hours: configureDate('hours'),
  days: configureDate('days')
}

const message = delta => ({
  seconds: `${time.seconds(delta)} seconds ago`,
  minutes: `${time.minutes(delta)} minutes ago`,
  hours: `${time.hours(delta)} hours ago`,
  days: `${time.days(delta)} days ago`
})

const check = main => ({
  seconds: date =>
    time.seconds(date) < 60 ? message(date).seconds : getDate(main, 'minutes'),
  minutes: date =>
    time.minutes(date) < 60 ? message(date).minutes : getDate(main, 'hours'),
  hours: date =>
    time.hours(date) < 24 ? message(date).hours : getDate(main, 'days'),
  days: date =>
    time.days(date) < 30 ? message(date).days : getDate(main, 'default'),
  default: () => new Date(main).toDateString()
})

export const getDate = (date, type = 'seconds') => {
  const now = new Date()
  const delta = now - new Date(date)
  const checker = check(date)
  return checker[type](delta)
}

export const getStars = stars => {
  if (stars > 1024) {
    return `${(stars / 1024).toFixed(1)}k`
  }
  return stars
}
