document.addEventListener('DOMContentLoaded', function() {
    const coverPage = document.getElementById('cover-page');
    const mainContent = document.getElementById('main-content');
    const openInvitationBtn = document.getElementById('open-invitation-btn');
    const guestNameDisplay = document.getElementById('guest-name');
    const backgroundMusic = document.getElementById('background-music');
    const musicControlBtn = document.getElementById('music-control-btn');
    const musicIcon = musicControlBtn.querySelector('i');
    const toggleBankInfoBtn = document.getElementById('toggle-bank-info-btn');
    const bankInfoContainer = document.getElementById('bank-info-container');
    const addToCalendarBtn = document.getElementById('add-to-calendar-btn');

    let isPlaying = false;

    openInvitationBtn.addEventListener('click', function() {
        coverPage.classList.add('hidden');
        setTimeout(() => {
            coverPage.style.display = 'none';
            mainContent.classList.remove('hidden');
            backgroundMusic.play().catch(e => console.error("Autoplay prevented:", e));
        }, 1000);
    });

    musicControlBtn.addEventListener('click', function() {
        if (isPlaying) {
            backgroundMusic.pause();
            musicIcon.classList.replace('fa-music', 'fa-volume-mute');
        } else {
            backgroundMusic.play().catch(e => console.error("Play prevented:", e));
            musicIcon.classList.replace('fa-volume-mute', 'fa-music');
        }
        isPlaying = !isPlaying;
    });

    backgroundMusic.addEventListener('play', () => {
        isPlaying = true;
        musicIcon.classList.replace('fa-volume-mute', 'fa-music');
    });

    backgroundMusic.addEventListener('pause', () => {
        isPlaying = false;
        musicIcon.classList.replace('fa-music', 'fa-volume-mute');
    });

    const sectionsToAnimate = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });

    sectionsToAnimate.forEach(section => observer.observe(section));

    if (toggleBankInfoBtn && bankInfoContainer) {
        toggleBankInfoBtn.addEventListener('click', function() {
            bankInfoContainer.classList.toggle('hidden');
            toggleBankInfoBtn.textContent = bankInfoContainer.classList.contains('hidden')
                ? 'Tampilkan Rekening Bank'
                : 'Sembunyikan Rekening Bank';
        });
    }

    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.dataset.accountTarget;
            const accountElement = document.getElementById(targetId);
            const feedback = document.getElementById(targetId.replace('account-number', 'copy-feedback'));

            const textToCopy = accountElement.textContent.trim();
            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = textToCopy;
            document.body.appendChild(tempTextArea);
            tempTextArea.select();

            try {
                document.execCommand('copy');
                if (feedback) {
                    feedback.textContent = 'Disalin!';
                    feedback.classList.add('show');
                    setTimeout(() => feedback.classList.remove('show'), 2000);
                }
            } catch (err) {
                console.error('Copy gagal:', err);
            } finally {
                document.body.removeChild(tempTextArea);
            }
        });
    });

    addToCalendarBtn.addEventListener('click', function() {
        const event = {
            title: 'Pernikahan Argha & Eva',
            description: 'Akad & Resepsi Argha & Eva',
            location: 'Dusun Jumbleng, Desa Wonokerto, Semarang',
            startDate: '2025-09-06T08:00:00',
            endDate: '2025-09-06T12:00:00'
        };

        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ArghaEvaWedding//EN
BEGIN:VEVENT
UID:${new Date().getTime()}@arghaeva.com
DTSTAMP:${new Date().toISOString().replace(/[-:]|\.\d{3}/g, '')}Z
DTSTART:${event.startDate.replace(/[-:]/g, '')}
DTEND:${event.endDate.replace(/[-:]/g, '')}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Pernikahan_Argha_Eva.ics';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});
