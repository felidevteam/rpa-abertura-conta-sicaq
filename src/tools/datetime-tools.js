export default class DateTimeTools {

    static delay(time) {
        return new Promise(function(resolve) {
            setTimeout(resolve, time)
        });
    }
}