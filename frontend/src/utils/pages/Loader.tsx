import { ProgressSpinner } from 'primereact/progressspinner';

const Loader = () => {
    return (
        <div className="w-full h-screen  bg-slate-50 flex items-center justify-center">
            <div className="text-center">
                <ProgressSpinner className='backdrop-blur-lg' />
                <h2 className='font-mono text-red-800 my-3 text-sm'>Loading</h2>
            </div>
        </div>
    )
}

export default Loader