if (Shows.find().count() === 0) {
    gotId = Shows.insert({
        name: 'Game of Thrones',
        external_id: 121361,
        runtime: 60,
        airs_at: '9:00 PM',
        day_of_week: 'Sunday',
        status: 'Continuing',
        overview: "Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north. Amidst the war, a neglected military order of misfits, the Night's Watch, is all that stands between the realms of men and icy horrors beyond.",
        updated_at: new Date().getTime()
    })
    hannibalId = Shows.insert({
        name: 'Hannibal',
        external_id: 259063,
        runtime: 60,
        airs_at: '10:00 PM',
        day_of_week: 'Friday',
        status: 'Continuing',
        overview: "Explores the early relationship between the renowned psychiatrist and his patient, a young FBI criminal profiler, who is haunted by his ability to empathize with serial killers.",
        updated_at: new Date().getTime()
    })
}
