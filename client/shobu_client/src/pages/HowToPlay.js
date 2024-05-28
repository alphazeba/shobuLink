import React from "react";
import './HowToPlay.css';
import { Header } from '../bits/Header';

export const HowToPlay = ({loginState}) => {
    return <div>
        <Header loginOptional={true} loginState={loginState}/>
        <div className="Title">
            How To Play
        </div>
        <div className="howToContainer">
            <HowToBlock title="Goal:">
                Push all opposing pieces off of any one board.
            </HowToBlock>
            <HowToBlock title="On your turn:">
                You will make 2 moves; a passive move and an active move.
            </HowToBlock>
            <HowToBlock title="Passive move:">
                Move any piece on either of the boards nearest yourself.
                <ul>
                    <li>You <span className="good">may</span> move 1 or 2 places horizontally, vertically, or diagonally.</li>
                    <li>You <span className="bad">may not</span> push any pieces.</li>
                </ul>
            </HowToBlock>
            <HowToBlock title="Active move:">
                Mirror your passive move onto any of your pieces on an opposing color board.
                <ul>
                    <li>You <span className="good">may</span> push a single opposing piece.</li>
                    <li>You <span className="bad">may not</span> push 2+ pieces.</li>
                    <li>You <span className="bad">may not</span> move your own piece off the board.</li>
                    <li>You <span className="bad">may not</span> push your own piece.</li>
                </ul>
            </HowToBlock>
            <HowToBlock title="Winning:">
                At the end of your turn, if you have pushed all your opponents pieces off on any board, you have won!
            </HowToBlock>
            <HowToBlock title="Now get out there!">
                Join a game <a className='btn myBtn' href={"/findGame"}> here</a>
            </HowToBlock>
        </div>
    </div>
}


const HowToBlock = ({title, children}) => {
    return <div className="howToBlock">
        <h1>{title}</h1>
        <div>
            {children}
        </div>
    </div>
}