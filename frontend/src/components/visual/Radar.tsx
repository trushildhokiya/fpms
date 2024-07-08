import { ResponsiveRadar } from '@nivo/radar'

type Props ={
    data?: any
}

const Radar = (props:Props) => {

    const data = [
        {
            "department": 'Computer',
            patent: 10,
            publication: 8,
            project: 15,
            consultancy: 4
        },
        {
            "department": 'Information Technology',
            patent: 1,
            publication: 1,
            project: 5,
            consultancy: 4
        },
        {
            "department": 'Atificial Intellligence and Data Science',
            patent: 10,
            publication: 1,
            project: 1,
            consultancy: 4
        },
        {
            "department": 'Electronics and Telecommunication',
            patent: 1,
            publication: 10,
            project: 1,
            consultancy: 1
        },
        {
            "department": 'Basic Science and Humanities',
            patent: 1,
            publication: 4,
            project: 6,
            consultancy: 1
        },
    ]

    return (
        <div className='h-[35rem]'>
            <ResponsiveRadar
                data={props.data ? props.data : data}
                keys={['patent', 'publication', 'project', 'consultancy','copyright']}
                indexBy="department" 
                blendMode='multiply'
                margin={{ top:50, left:50, right:50, bottom:50}}
            />
        </div>
    )
}

export default Radar