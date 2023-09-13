export const pauseUnpause = async (tokenContract: any) => {
  console.log('\n', '=== Pause manipulation ===');

  console.log('Pausing token ...');
  const pause = await tokenContract.pause();
  await pause.wait();
  console.log('Is token paused?', await tokenContract.paused());

  console.log('Unpausing token ...');
  const unpause = await tokenContract.unpause();
  await unpause.wait();
  console.log('Is token paused?', await tokenContract.paused());
}
