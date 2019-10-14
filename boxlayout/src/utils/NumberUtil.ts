namespace boxlayout{
    export class NumberUtil{
        public static sin(value:number):number{
            var valueFloor = Math.floor(value);
            var valueCeil = valueFloor + 1;
            var resultFloor = NumberUtil.sinInt(valueFloor);
            if (valueFloor == value) {
                return resultFloor;
            }
            var resultCeil = NumberUtil.sinInt(valueCeil);
            return (value - valueFloor) * resultCeil + (valueCeil - value) * resultFloor;
        }
        public static sinInt(value:number):number{
            value = value % 360;
            if (value < 0) {
                value += 360;
            }
            return Math.sin(value);
        }
        public static cos(value:number):number{
            var valueFloor = Math.floor(value);
            var valueCeil = valueFloor + 1;
            var resultFloor = NumberUtil.cosInt(valueFloor);
            if (valueFloor == value) {
                return resultFloor;
            }
            var resultCeil = NumberUtil.cosInt(valueCeil);
            return (value - valueFloor) * resultCeil + (valueCeil - value) * resultFloor;
        }
        public static cosInt(value:number):number{
            value = value % 360;
            if (value < 0) {
                value += 360;
            }
            return Math.cos(value);
        }
    }
}