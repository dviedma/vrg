import { useDispatch } from 'react-redux';

import * as PlaySettingsActions from '../../actions/playSettingsActions';

export default function handler(req, res) {
  const dispatch = useDispatch();

  console.log(">>>> Incoming request", req.body);
  if (req.method === 'POST') {
    console.log(">>> POST:", req.body);
    // DV:
    // Play video with id 'object_id'
    // dispatch(PlaySettingsActions.startPlay(object_id)
    dispatch(PlaySettingsActions.startPlay());
  }
  res.status(200).json(req)
}

/*
Event Data:- name = cloud.jvqlz5fd.transcoder.bpcqbsjv.start.requested
- cloud_account_id = jvqlz5fd
- object_type = transcoder
- object_id = bpcqbsjv <<<<<<
- action = start.requested
- message = {:id=>"faf0071e-3e7f-48fa-8a5e-ee0ef82e550f", 
:timestamp=>1614443168.421691, :level=>"info", :severity=>20, :data=>{:uptime_id=>"8jjdbyqc", 
:private=>{:wcl_transcoder_id=>5365100, :stackable=>"0", :user_region_id=>7, :provider=>"aws", 
:schedule_task_id=>nil, :ull_origin_region=>nil, :ull_origin_host=>nil, 
:profile_id=>86589}}, :tracking=>{}, :trigger=>{:source=>"wsc", :source_id=>""}}
*/