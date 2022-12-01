import React, { useState, useEffect } from "react";
import { vdhattr } from "./DataUtil";
import './VanDenHeuvel.css';
export default function VanDenHeuvel(props) {
    const [imageIndex, setImageIndex] = useState(null);
    const [eventSequenceIndex, setEventSequenceIndex] = useState(null);
    const [eventString, setEventString] = useState(null);
    const [rotateimage, setRotateImage] = useState(null);

    const dummystr = [
        'Zero-age main-sequence, metallicity Z=0.0010',
        'Stable mass transfer from 1 to 2',
        'Star 1 undergoes supernova and forms a BH',
        'Common envelope initiated by 2',
        'Star 2 undergoes supernova and forms a BH',
        'Double compact object BH+BH merging in 7.5 Myr' //Tdlay
    ]
    //const eventIndex = [2, 26, 13, 49, 15, 51]; //should generate these
    const eventAlphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const stellarTypes = [
        //'MS$<0.7M_\odot$',
        'MS',
        //'MS$\geq0.7M_\odot$',
        'MS',
        'HG', 'FGB', 'CHeB', 'EAGB', 'TPAGB', 'HeMS', 'HeHG',
        'HeGB', 'HeWD', 'COWD', 'ONeWD', 'NS', 'BH', 'MR'];
    //eventIndex, and 

    const getEvents = () => {
        let imageIndices = [];
        let sequenceIndices = [];
        let eventStrings = [];
        let isMerger = false;

        //Beginning of event
        sequenceIndices.push(0);
        imageIndices.push(2);
        eventStrings.push(`Zero-age main-sequence, metallicity Z=${vdhattr.Z1[0]}`);

        //iterate through time sequence
        for (let i = 0; i < vdhattr.time.length; i++) {
            if (i == 0) continue;
            //if (isMerger) break;

            let stype1 = vdhattr.Stellar_Type1[i];
            let stype2 = vdhattr.Stellar_Type2[i];

            //eventClass=='Mass Transfer'
            if (vdhattr.MT_history[i] > 0 && vdhattr.MT_history[i - 1] !== vdhattr.MT_history[i]) {
                let image_num, eventstring;
                let mtValue = vdhattr.MT_history[i];
                isMerger = true;

                switch (mtValue) {
                    case 1:
                        eventstring = `Stable mass transfer from 1 to 2`;
                        if (stype2 < 13) {
                            image_num = 26;
                        } else {
                            image_num = 44;
                            setRotateImage((prev) => ({ ...prev, image_num: true }));
                        }
                    case 2:
                        eventstring = `Stable mass transfer from 2 to 1`;
                        if (stype2 < 13) {
                            image_num = 26;
                            setRotateImage((prev) => ({ ...prev, image_num: true }));
                        } else {
                            image_num = 44;
                        }
                        break;
                    case 3:
                    case 4:
                        eventstring = `Common envelope initiated by ${Math.floor(mtValue / 2)}`;
                        image_num = (stype1 < 13 && stype2 < 13) ? 28 : 49;
                        break;
                    case 5:
                        eventstring = `Double-core common envelope`;
                        image_num = 28;
                        break;
                    case 6:
                        image_num = 37;
                        eventstring = `Stellar Merger: ${stellarTypes[stype1]}+${stellarTypes[stype2]}`;
                        break;
                    default:
                        throw new Error('Unknow MT_history');
                }
                sequenceIndices.push(i);
                imageIndices.push(image_num);
                eventStrings.push(eventstring);
            }

            //eventClass = 'supernova' or 'stellar type change'
            let type_changed_star, isSupernova; //which star 
            if (stype1 !== vdhattr.Stellar_Type1[i - 1]) {
                type_changed_star = 1;
                isSupernova = stype1 === 13 || stype1 === 14;
            }
            if (stype2 !== vdhattr.Stellar_Type2[i - 1]) {
                type_changed_star = 2;
                isSupernova = stype2 === 13 || stype2 === 14;
            }
            if (type_changed_star) {
                let image_num, eventstring;
                //if supernova
                if (isSupernova) {
                    let remType = type_changed_star === 1 ? stype1 : stype2;
                    let comType = type_changed_star === 1 ? stype2 : stype1;
                    let disrupted = vdhattr.eccentricity[i] > 1 || vdhattr.semimajor[i] < 0;
                    eventstring = `Star ${remType} undergoes supernova and forms a ${stellarTypes[remType]} `
                        + `${disrupted ? '. Orbit becomes unbound' : ''}.`;
                    if (disrupted) {
                        if (comType < 13) {
                            image_num = remType === 13 ? 19 : 20;
                        } else if (comType === 13) {
                            image_num = remType === 13 ? 22 : 21;
                        } else {
                            image_num = remType === 13 ? 24 : 23;
                        }
                    } else {
                        image_num = comType === 13 ? 13 : 15;
                    }
                } else {
                    let stypePre = vdhattr[`Stellar_Type${type_changed_star}`][i - 1];
                    let stypePost = vdhattr[`Stellar_Type${type_changed_star}`][i];
                    //no image_num
                    eventstring = `Star ${type_changed_star}: ${stellarTypes[stypePre]} -> ${stellarTypes[stypePost]} `;
                }
                sequenceIndices.push(i);
                imageIndices.push(image_num);
                eventStrings.push(eventstring);
            }
            if (i === vdhattr.time.length - 1 && !isMerger) {
                let eventstring, image_num;
                let isUnbound = vdhattr.eccentricity[i] > 1 || vdhattr.semimajor[i] < 0;
                let types = Array.from({ length: 5 }, (a, b) => b + 10);

                let isDCO = types.includes(stype1) && types.includes(stype2);
                if (isDCO) {
                    let Msunkg = 1.98892e30;
                    let c = 299792458;
                    let G = 6.67428e-11;
                    let Rsun = 695500000;
                    let a = vdhattr.semimajor[i] * Rsun;
                    let e = vdhattr.eccentricity[i];
                    let m1 = vdhattr.mass1[i];
                    let m2 = vdhattr.mass2[i];
                    let beta = 64 / 5 * G ** 3 * m1 * m2 * (m1 + m2) * Msunkg ** 3 / c ** 5;
                    let T0 = a ** 4 / 4 / beta;
                    let Tdelay = T0 * (1 - e ** 2) ** (7 / 2) * (
                        1 + 0.31 * e ** 10 + 0.27 * e ** 20 + 0.2 * e ** 1000) / 3.15e7 / 1e6;
                    eventstring = `Double compact object (${stellarTypes[stype1]}+${stellarTypes[stype2]}) merging in ${Tdelay.toFixed(2)} Myr`;
                    if (stype1 === 13 && stype2 === 13) image_num = 55;
                    else if (stype1 === 14 && stype2 === 14) image_num = 51;
                    else image_num = 53;
                } else if (isUnbound) {
                    eventstring = `Unbound : ${stellarTypes[stype1]}+${stellarTypes[stype2]}`;
                } else {
                    eventstring = `Evolution ended by run duration: ${stellarTypes[stype1]}+${stellarTypes[stype2]}`;
                    image_num = 2;
                }
                sequenceIndices.push(i);
                imageIndices.push(image_num);
                eventStrings.push(eventstring);
            }
        }
        setImageIndex(imageIndices);
        setEventSequenceIndex(sequenceIndices);
        setEventString(eventStrings);
    }

    useEffect(() => {
        getEvents();
    }, []);

    const imageDiv = (imageIndex, rotate_image = false) => { //index: eventIndex value, i: sequence number
        //rotate image here
        if (!imageIndex) return (<div className="cartoon"></div>);
        const filepath = `/vanDenHeuvel_figures/${imageIndex}.png`;
        return (<div className="cartoon"><img src={filepath} /></div>);
    }

    const bebold = input => <b className="bold">{input}</b>;

    const descDiv = (index, i) => { //index: eventIndex value, i: sequence number 
        //let index = eventIndex[i];
        return (<div className="desc"> Time = {bebold(vdhattr.time[index])} Myr, a = {bebold(vdhattr.semimajor[index])} R<sub>⊙</sub>
            <br /> M<sub>1</sub> = {bebold(vdhattr.mass1[index])} M<sub>⊙</sub>, M<sub>2</sub> = {bebold(vdhattr.mass2[index])} M<sub>⊙</sub>
            <br /> {eventString[i]}
        </div>);
    }

    const eventSequenceDiv = (i) => { return <div className="alphabet">{eventAlphabet[i]}</div> }

    return (<div>
        {eventSequenceIndex && eventSequenceIndex.map((index, i) => <><div className="container">
            {imageIndex[i] && eventSequenceDiv(i)}
            {imageIndex[i] && imageDiv(imageIndex[i])}
            {imageIndex[i] && descDiv(index, i)}</div></>)}
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