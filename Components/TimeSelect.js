const TimeSelect = (props) => {
    const fromChangeHandler = (e) => {
        props.fromChange(e.target.value)
    }

    const toChangeHandler = (e) => {
        props.toChange(e.target.value)
    }

    return <div className="flex flex-row justify-between gap-3">
                        <select onChange={fromChangeHandler} disabled={props.disable} className="bg-light-blue ps-2 placeholder:text-sml text-dark-brown text-sml placeholder:text-light-brown rounded-sm" style={{width: "90px", height: "27px"}}>
                            <option disabled>From</option>
                            <option selected={props.timeSelect === 0} value="0" className="">00:00</option>
                            <option value="1" selected={props.timeSelect === 1} className="">01:00</option>
                            <option value="2" selected={props.timeSelect === 2} className="">02:00</option>
                            <option value="3" selected={props.timeSelect === 3} className="">03:00</option>
                            <option value="4" selected={props.timeSelect === 4} className="">04:00</option>
                            <option value="5" selected={props.timeSelect === 5} className="">05:00</option>
                            <option value="6" selected={props.timeSelect === 6} className="">06:00</option>
                            <option value="7" selected={props.timeSelect === 7 || isNaN(props.timeSelect)} className="">07:00</option>
                            <option value="8" selected={props.timeSelect === 8} className="">08:00</option>
                            <option value="9" selected={props.timeSelect === 9} className="">09:00</option>
                            <option value="10" selected={props.timeSelect === 10} className="">10:00</option>
                            <option value="11" selected={props.timeSelect === 11} className="">11:00</option>
                            <option value="12" selected={props.timeSelect === 12} className="">12:00</option>
                            <option value="13" selected={props.timeSelect === 13} className="">13:00</option>
                            <option value="14" selected={props.timeSelect === 14} className="">14:00</option>
                            <option value="15" selected={props.timeSelect === 15} className="">15:00</option>
                            <option value="16" selected={props.timeSelect === 16} className="">16:00</option>
                            <option value="17" selected={props.timeSelect === 17} className="">17:00</option>
                            <option value="18" selected={props.timeSelect === 18} className="">18:00</option>
                            <option value="19" selected={props.timeSelect === 19} className="">19:00</option>
                            <option value="20" selected={props.timeSelect === 20} className="">20:00</option>
                            <option value="21" selected={props.timeSelect === 21} className="">21:00</option>
                            <option value="22" selected={props.timeSelect === 22} className="">22:00</option>
                            <option value="23" selected={props.timeSelect === 23} className="">23:00</option>
                        </select>
                        <select onChange={toChangeHandler} disabled={props.disable} className="bg-light-blue ps-2 placeholder:text-sml text-dark-brown text-sml placeholder:text-light-brown rounded-sm" style={{width: "90px", height: "27px"}}>
                            <option disabled>To</option>
                            <option value="0" selected={props.toTimeSelect === 0}>00:00</option>
                            <option value="1" selected={props.toTimeSelect === 1}>01:00</option>
                            <option value="2" selected={props.toTimeSelect === 2}>02:00</option>
                            <option value="3" selected={props.toTimeSelect === 3}>03:00</option>
                            <option value="4" selected={props.toTimeSelect === 4}>04:00</option>
                            <option value="5" selected={props.toTimeSelect === 5}>05:00</option>
                            <option value="6" selected={props.toTimeSelect === 6}>06:00</option>
                            <option value="7" selected={props.toTimeSelect === 7}>07:00</option>
                            <option value="8" selected={props.toTimeSelect === 8}>08:00</option>
                            <option value="9" selected={props.toTimeSelect === 9}>09:00</option>
                            <option value="10" selected={props.toTimeSelect === 10}>10:00</option>
                            <option value="11" selected={props.toTimeSelect === 11}>11:00</option>
                            <option value="12" selected={props.toTimeSelect === 12}>12:00</option>
                            <option value="13" selected={props.toTimeSelect === 13}>13:00</option>
                            <option value="14" selected={props.toTimeSelect === 14}>14:00</option>
                            <option value="15" selected={props.toTimeSelect === 15}>15:00</option>
                            <option value="16" selected={props.toTimeSelect === 16}>16:00</option>
                            <option value="17" selected={props.toTimeSelect === 17}>17:00</option>
                            <option value="18" selected={props.toTimeSelect === 18}>18:00</option>
                            <option value="19" selected={props.toTimeSelect === 19}>19:00</option>
                            <option value="20" selected={props.toTimeSelect === 20}>20:00</option>
                            <option value="21" selected={props.toTimeSelect === 21}>21:00</option>
                            <option value="22" selected={props.toTimeSelect === 22  || isNaN(props.toTimeSelect)}>22:00</option>
                            <option value="23" selected={props.toTimeSelect === 23}>23:00</option>
                        </select> 
                    </div>
}

export default TimeSelect;