import React from 'react';
import './styles.css';
import * as data from './links.json';
// import logo from './intra.png';

const linksString = JSON.stringify(data);
const links = JSON.parse(linksString).links;

type Link = {
    label: string;
    href: string;
};

const Links: React.FC<{ links: Link[] }> = ({ links }) => {
    return (
        <div className='links-container'>
            {links.map((link: Link) => {
                return (
                    <div key={link.href} className='link'>
                        <a href={link.href}>
                            {link.label}
                        </a>
                    </div>
                )
            })}
        </div>
    )
};

export function Nav() {
    return (
        <nav className='navbar'>
            <div>
				logo(bu neden calismiyor?)
               {/* <img style={{height:50}}   src={logo}></img> */}
            </div>
            <Links links={links} />
        </nav>
    )
}
