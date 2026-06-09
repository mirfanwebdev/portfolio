import { useState, useEffect } from 'preact/hooks';
import styles from './Navbar.module.css';

type Link = {
    id: string;
    label: string;
    href: string;
}

type NavbarProps = {
    links: Link[];
    resumeUrl: string;
}

export default function Navbar({ links, resumeUrl }: NavbarProps) {
    const {
        location,
        isOpen,
        handleToggle,
        handleLink,
    } = useNavbar();

    return (
        <nav class={styles.navbar}>
            <OuterMenu isOpen={isOpen} />

            <div class={styles.mobileMenu} style={{ right: isOpen ? "0" : "" }}>
                {links && (
                    <div class={styles.links}>
                        {links.map((link: Link) => (
                            <a
                                href={link.href}
                                class={location === link.href ? styles.active : ""}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleLink(link.href);
                                }}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                )}

                <LinkResume url={resumeUrl} />
            </div>

            <div class={styles.toggle}>
                {isOpen ? (
                    <button onClick={handleToggle}>Close</button>
                ) : (
                    <button onClick={handleToggle}>Menu</button>
                )}
            </div>
        </nav>
    )
}

function useNavbar() {
    const [location, setLocation] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    // const [activeSection, setActiveSection] = useState("");

    useEffect(() => {
        setLocation(window.location.hash);
    }, []);

    useEffect(() => {
        let sections = document.querySelectorAll("section");
        const observerOptions = {
            root: null,
            rootMargin: "0px",
            threshold: 0.5,
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    handleLocationChange(`#${entry.target.id}`);
                    // setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        sections.forEach((section) => observer.observe(section));

        return () => {
            observer.disconnect();
        };
    }, []);

    const handleLink = (loc: string) => {
        handleLocationChange(loc);
        setIsOpen(false);
    }
    const handleLocationChange = (loc: string) => {
        setLocation(loc);
    }
    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    return {
        location,
        isOpen,
        handleLink,
        handleToggle,
        handleLocationChange,
    }
}

function LinkResume({ url }: { url: string }) {
    return (
        <a class={styles.resume} href={url} target="_blank" rel="noopener noreferrer">
            Resume
        </a>
    )
}

function OuterMenu({ isOpen }: { isOpen: boolean }) {
    if (isOpen) {
        return (
            <div class={styles.outerMenu}></div>
        )
    } else return (
        <div class={styles.outerMenu} style={{ zIndex: "-1" }}></div>
    )
}