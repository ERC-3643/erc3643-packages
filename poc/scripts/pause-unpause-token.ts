export const pauseUnpause = async (tokenContract: any) => {
  console.log('\n', '=== Pause manipulation ===');

  const pause = await tokenContract.pause();
  await pause.wait();
  console.log('Token is paused:', await tokenContract.paused());

  const unpause = await tokenContract.unpause();
  await unpause.wait();
  console.log('Token is paused:', await tokenContract.paused());
}
