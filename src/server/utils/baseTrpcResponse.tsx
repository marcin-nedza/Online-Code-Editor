
type BaseTrpcResponse={
    data?:any;
    error?:string|null;
    status:'success'|'failed'
}
export const baseTrpcResponse=({data={},error=null,status='success' as const}:BaseTrpcResponse)=>{
    const success=()=>{
        return baseTrpcResponse({data,status:'success'})
    }
    const failed=(msg:string)=>{
        return baseTrpcResponse({error:msg,status:'failed'})
    }
    return {data,error,status,success,failed}
}
