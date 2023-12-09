
# "Dummy Lock" Plugin

Example config.json:

```
    "accessories": [
        {
          "accessory": "DummyLock",
          "name": "My Lock 1"
        }   
    ]

```


With this plugin, you can create any number of fake locks that will do nothing when turned on or off.  This is related to (and the idea taken from) the homebridge-dummy-switch plugin, but with a lock, you must unlock your HomeKit controlling device to change the state.  Likewise push notifications are sent when the device lock state changes.

## Example
My kids love to turn on stuff by talking to Siri to bypass the screenlock. (ie, turn on the TV)  They also discovered the button on the HomeKit switch which manually changes the power state of the device without HomeKit.  With this software only lock, you can overide the manual override to make sure the power stays off, and prevent Siri commands from the lock screen to turn on a device.  

Example rules:

(Device: TV Switch, dummy lock: TV)

* Trigger on "TV Switch" on event, condition TV Locked, Turn off TV Switch
* Trigger on "TV" unlocked event, turn on TV Switch
* Trigger on "TV" locked event, turn off TV Switch

Get fancy by adding a Delay switch called "1 Hour Timer" to limit screentime:
* Trigger on "1 Hour Timer" off event, lock TV
* Trigger on "TV Switch" on event, turn on "1 Hour Timer"

Instead, you can link scenes using these dummy switches. Let's say you have a Hue Scene called "Rise and Shine" that you want to activate in the morning. And you have also setup the system HomeKit scene "Good Morning" to turn on your coffee maker and disarm you security system. You can add a single dummy switch to your Good Morning scene, then create a Trigger based on the switching-on of the dummy switch that also activates Rise And Shine.
