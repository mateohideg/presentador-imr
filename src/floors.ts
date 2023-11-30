let currentFloor: Floor;
let locationId: number;
let ctx: CanvasRenderingContext2D;

// For future reference
export enum Floor {
    Gymnasium = -1,
    Ground = 0,
    Top = 1
}

export const locationIds = {
    gymnasium: ['0', '17', '18', '19', '25', '24', '23', '22', '20', '21'],
    ground: ['12', '13', '14', '14', '15', '11', '16'],
    top: ['4', '5', '6', '7', '8', '1', '3', '2', '9', '10']
}

export const drawFloors = (theCtx: CanvasRenderingContext2D, floor: Floor, theLocationId?: number) => {
    // Make some variables global
    currentFloor = floor;
    locationId = theLocationId ?? NaN;
    ctx = theCtx;

    // Prepare the common settings
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'black';

    // Draw the floor
    if (floor === -1) drawGymnasiumFloor(); else if (floor === 0) drawGroundFloor(); else if (floor === 1) drawTopFloor();
}

// Functions for each floor

const drawGroundFloor = () => {
    // Draw all the left-side 'rooms'
    for (let i = 0; i < 5; i++) {
        drawRoom(0, 92.5 + (i * 75) + (10 * i), locationIds.ground[i], false);
    }

    drawCircleRoom(225, 160, locationIds.ground[5]);

    // Draw the inside 'room'
    drawRoom(150, 432.5, locationIds.ground[6], false);

    // Draw a centered floor
    drawFloor(false);
}

const drawGymnasiumFloor = () => {
    drawStage(85, 10, locationIds.gymnasium[0])

    // Draw all the left-side 'rooms'
    for (let i = 0; i < 3; i++) {
        drawRoom(0, 177.5 + (i * 75) + (10 * i), locationIds.gymnasium[i + 1], true);
    }

    // Draw all the right-side 'rooms'
    for (let i = 0; i < 4; i++) {
        drawRoom(375, 92.5 + (i * 75) + (10 * i), locationIds.gymnasium[i + 4], true);
    }

    // Draw the inside 'room's
    drawRoom(187.5, 450, locationIds.gymnasium[8], true);
    drawRoom(187.5, 525, locationIds.gymnasium[9], false);

    drawEntrance(287.5, 525);

    // Draw a full floor
    drawFloor(true);
}

const drawTopFloor = () => {
    // Draw all the left-side 'rooms'
    for (let i = 0; i < 5; i++) {
        drawRoom(0, 92.5 + (i * 75) + (10 * i), locationIds.top[i], false);
    }

    // Draw the right-side 'room'
    drawRoom(375, 75, locationIds.top[5], false);

    // Draw 'circle'
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.arc(205, 190, 40, 0, (Math.PI * 2), false);
    ctx.stroke();

    // Draw the inside 'rooms'
    for (let i = 0; i < 2; i++) {
        drawRoom(260 + (i * 50) + (10 * i), 150, locationIds.top[i + 6], false, 50);
    }

    // Draw the inside 'room'
    drawRoom(150, 375, locationIds.top[8], false);

    // Draw the outside 'room'
    drawRoom(150, 525, locationIds.top[9], false);

    // Draw 'hall'
    ctx.beginPath();
    ctx.moveTo(150, 150);
    ctx.lineTo(375, 150);
    ctx.moveTo(150, 150);
    ctx.lineTo(150, 375);
    ctx.stroke();

    // Draw a centered floor
    drawFloor(false);
}


// Common functions

const drawFloor = (fullOne: boolean) => {
    // Draw the room's floor; false for centered, true for full-size
    ctx.strokeStyle = 'black';
    ctx.strokeRect(fullOne ? 0 : 75, fullOne ? 0 : 75, fullOne ? 450 : 300, fullOne ? 600 : 450);
}

const drawRoom = (x: number, y: number, number: string, stand: boolean, width?: number) => {
    // Set dashes if it's a stand
    if (stand) {
        ctx.setLineDash([1]);
    }

    // Draw the 'room' itself
    if (Number(number) === locationId) {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(x, y, width ?? 75, 75);
    }

    ctx.strokeStyle = 'blue';
    ctx.strokeRect(x, y, width ?? 75, 75);

    // Draw the text with the ID
    ctx.fillStyle = 'black';
    ctx.font = '25px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(number, x + ((width ?? 75) / 2), y + (75 / 2));

    // Reset dashes
    ctx.setLineDash([]);
}

const drawEntrance = (x: number, y: number) => {
    // Draw the entrance itself
    ctx.strokeStyle = 'green';
    ctx.strokeRect(x, y, 75, 75);

    // Draw the text
    ctx.fillStyle = 'black';
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Entrada', x + (75 / 2), y + (75 / 2));
}

const drawCircleRoom = (x: number, y: number, number: string) => {
    // Draw the circle itself
    ctx.strokeStyle = 'blue';
    ctx.beginPath();
    ctx.arc(x, y, 75, 0, (Math.PI * 2), false);

    if (Number(number) === locationId) {
        ctx.fillStyle = 'yellow';
        ctx.fill();
    }

    ctx.stroke();

    // Draw the text with the ID
    ctx.fillStyle = 'black';
    ctx.font = '25px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(number, x, y);
}

const drawStage = (x: number, y: number, number: string) => {
    // Draw the stage itself
    if (Number(number) === locationId) {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(x, y, 280, 150);
    }

    ctx.strokeStyle = 'black';
    ctx.strokeRect(x, y, 280, 150);

    // Draw the text with the ID
    ctx.fillStyle = 'black';
    ctx.font = '25px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(number, x + (280 / 2), y + (150 / 2));
}
