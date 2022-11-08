import React, { useState } from "react";
import { vdhattr } from "./DataUtil";
import './VanDenHeuvel.css';
export default function VanDenHeuvel(props) {
    const dummystr = [
        'Zero-age main-sequence, metallicity Z=0.0010',
        'Stable mass transfer from 1 to 2',
        'Star 1 undergoes supernova and forms a BH',
        'Common envelope initiated by 2',
        'Star 2 undergoes supernova and forms a BH',
        'Double compact object BH+BH merging in 7.5 Myr' //Tdlay
    ]
    const eventIndex = [2, 26, 13, 49, 15, 51];
    const events = ['A', 'B', 'C', 'D', 'E', 'F'];

    const imageDiv = (index) => { //index: eventIndex value, i: sequence number
        //let index = eventIndex[i];
        const filepath = `/vanDenHeuvel_figures/${index}.png`;
        return (<div className="cartoon"><img src={filepath} /></div>);
    }

    const bebold = input => <b className="bold">{input}</b>;

    const descDiv = (index, i) => { //index: eventIndex value, i: sequence number 
        //let index = eventIndex[i];
        return (<div className="desc"> Time = {bebold(vdhattr.time[index])} Myr, Semi-major axis = {bebold(vdhattr.semimajor[index])} R<sub>⊙</sub>
            <br /> M<sub>1</sub> = {bebold(vdhattr.mass1[index])} M<sub>⊙</sub>, M<sub>2</sub> = {bebold(vdhattr.mass2[index])} M<sub>⊙</sub>
            <br /> {dummystr[i]}
        </div>);
    }

    const eventSequenceDiv = (i) => { return <div className="alphabet">{events[i]}</div> }

    return (<div>
        {eventIndex.map((index, i) => <><div className="container">
            {eventSequenceDiv(i)}
            {imageDiv(index)}
            {descDiv(index, i)}</div></>)}
    </div>);
}

/*
  if image_num is not None:
            self.eventImage = self.getEventImage(image_num, rotate_image)

        return eventString

    def getEventImage(self, image_num, rotate_image):
        """
        Map the eventClass and possibly eventSubClass, with information
        on the stellar types, to get the van den Heuvel diagrams.
        """

        self.imgFile = compasRootDir + '/utils/media/vanDenHeuvel_figures/{}.png'.format(image_num)
        img = plt.imread(self.imgFile)  # import image
        if rotate_image:
            img = img[:, ::-1, :]  # flip across y-axis
        return img

def plotVanDenHeuvel(events=None):
    # Only want events with an associated image
    events = [event for event in events if (event.eventImage is not None)]
    num_events = len(events)
    fig, axs = plt.subplots(num_events, 1)
    if num_events == 1:
        axs = [axs]
    fig.set_figwidth(9)
    plt.rcParams["text.usetex"] = True  # Use latex

    for ii in range(num_events):
        img = events[ii].eventImage
        axs[ii].imshow(img)
        axs[ii].set_xticks([])
        axs[ii].set_yticks([])
        axs[ii].yaxis.set_label_position("right")
        plt.subplots_adjust(hspace=0)

        if ii == 0:
            pltString = "$t$ = {:.1f} Myr, $a$ = {:.1f} $R_\odot$ \n" \
                        " $M_1$ = {:.1f} $M_\odot$, $M_2$ = {:.1f} $M_\odot$ \n" \
                        + events[ii].eventString
            pltString = pltString.format(events[ii].time, events[ii].a, events[ii].m1, events[ii].m2)
        else:
            pltString = "$t$ = {:.1f} Myr, $a$ = {:.1f} to {:.1f} $R_\odot$ \n" \
                        " $M_1$ = {:.1f} to {:.1f} $M_\odot$, $M_2$ = {:.1f} to {:.1f} $M_\odot$ \n" \
                        + events[ii].eventString
            pltString = pltString.format(events[ii].time, events[ii].aprev, events[ii].a, events[ii].m1prev,
                                         events[ii].m1, events[ii].m2prev, events[ii].m2)

        pad = 5
        axs[ii].annotate(pltString, xy=(0, 0.5), xytext=(-axs[ii].yaxis.labelpad + pad, 0),
                         xycoords=axs[ii].yaxis.label, fontsize=8, textcoords='offset points', ha='left', va='center')
        axs[ii].annotate(chr(ord('@') + 1 + ii), xy=(-0.15, 0.8), xycoords='axes fraction', fontsize=8,
                         fontweight='bold') */